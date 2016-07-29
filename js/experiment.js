// Browser limitation
// array.includes(element) is not supported on all platforms (notably, IE and Edge do not).
// TODO
// DONE- Random numbers
// DONE Flow - Go > Correct/Incorrect > Next
// DONE- Remember the user
// DONE Count the trials
// DONE Save with User
// DONE Close side panel
// DONE- Mix material and ios themes
// - Look at Pukar's requirements in Messenger
// - Adjust the timing of theme swapping to avoid the blue strip on top of screen
//   when Pattern 2 is the first pattern (and finishes in the tab, not the list menu)
// DONE Tabbar empty icon

/* 
Data to catpure for a trial
- Participant ID
- Trial Number
- Navigation pattern
- Target item
- Item position
- Selection time of item
- Error count
- Total trial duration
*/

var NOBexperiment = (function () {
    'use strict';
    
    //Object to be return to provide public properties to the caller
    var experiment = {},
        
    // parameters that can / should be changed 
        numberOfMenuItems      = 10,  // default number of menu items displayed
        numberOfMenuCandiates  = 99, // 1-n menu items will be used to randomly generate the menu
        numberOfTrials       = 1, // Number of repeats in one pattern
    
    //properties   
        participant,
        experimentResult = {}, // object to be sent
        trialInfo = [], // list that holds the information of a given trial 
        results = [],
        patternCurrent,
        patternsFinished = [],
        timeStart,
        timeEnd,
        trialDuration,
        dictionary = [];
        for(var i=1; i<=numberOfMenuCandiates; i++) {
          //Padding with 0 in front.
          
          var lenMax      = numberOfMenuCandiates.toString().length,
              a           = String(i),
              lenCurrent  = a.length;
          
          while (lenCurrent<lenMax){
            a = '0' + a;
            lenCurrent  = a.length;
          }
          
          dictionary.push(a);
        }
    var numberOfTrialCurrent = 0, // Current Nth trial << This gets reset in every pattern
        resultNth = 0, // Current Nth Trial << This continues across patterns
        menuItemTarget,
        targetText;
  
    $$('#form-participant-submit').on('click', function() {
      participant = myApp.formToJSON('#form-participant-id');
      if(participant.number) {
        mainView.router.load({pageName: 'instructions'});
      } else {
        myApp.alert('Please enter your participant number.', 'Participant Number Missing');
      }
    });
  
    $$('#buttonStartPattern1').on('click', function() {
      patternSet(1);
      trialStart();
    });
  
    $$('#buttonStartPattern2').on('click', function() {
      patternSet(2);
      trialStart();
    });
  
    $$('#buttonStart').on('click', function() {
      timeStart = Date.now();
    });
    
    $$('.buttonStartTrial').on('click', function() {
      trialStart();
    });
  
    $$('.buttonStartTrialIncorrect').on('click', function() {
       trialStart();
    });
  
    $$('#buttonThankYou').on('click', function() {
      $$('a.buttonStartTrial').attr('href', '#Go');
    });
  
    function saveExperiment() {

        if(results.length != 0){
            var req = new XMLHttpRequest();
            req.open("POST", "", false); // Syncronous call is deprecated. TODO
            req.send(JSON.stringify(experimentResult));
            console.log(req.responseText); 
          
            myApp.alert('The experiment is complete.', 'Thank You!');
        }else{
            // You cannot be here.
        }
      
    }
  
    function patternSet(p) {
      patternCurrent = p;
      
      var css = (p==1) ? 'css/framework7.material.min.css' : 'css/framework7.ios.min.css';
      $$( '#themeCSS' ).attr('href', css);
      
      $$('#buttonStart').attr('href', '#pattern'+p);
    }
    
    function patternEnd() {
      $$('a.buttonStartTrial').attr('href', '#thank-you');
      patternsFinished.push(patternCurrent);
      var nextPattern = (patternCurrent == 1) ? 2 : 1; // swapping
      patternSet(nextPattern);
      numberOfTrialCurrent = 0;
      
      var button = $$('a#buttonThankYou');
      var text;
      var href
      if (patternsFinished.length < 2) {
        text = "Continue" ;
        href = "#Go";
      } else {
        text = "Finish" ;
        href = "#";
        button.once('click', saveExperiment); // probably this one should accept a callback to pop up confirmation
      }
      button.text(text);
      button.attr('href', href);
    }
  
    function trialStart() {
        trialInfo = [];
        trialInfo.push(participant.number);
        trialInfo.push(patternCurrent);
        trialReset();
        menuCreate(numberOfMenuItems);
        targetDisplay();
        trialsToGO();
        //timeStart = Date.now();
    }
    
    function trialEnd() {
    //    timeEnd = Date.now();      
        trialResultWrite();
        trialReset();
        numberOfTrialCurrent += 1;
        if (numberOfTrials - numberOfTrialCurrent == 0) {
          patternEnd();
        }
    }

    function trialReset() {
        if (patternCurrent == 1) {
        // Resetting Pattern 1 (slide menu)
          var ul = document.getElementById("navigationMenu");
          while (ul.firstChild) {
              ul.removeChild(ul.firstChild);
          }
          targetRemove();
        } else {
        // Resetting Pattern 2 (tabbar)
          $$('#tabbar').children().remove();
          $$('#moreTabList').children().remove();
          myApp.showTab('#defaultTab');
        }
    }

    function trialResultWrite() {
        var resultDisplay = $$('.resultDisplay');
        resultDisplay.text(trialDuration/1000 + " seconds");
        //resultDisplay.appendChild(p);
    }
  
    function trialsToGO() {
      var nToGo = numberOfTrials - numberOfTrialCurrent;
      $$('#trialsToGo').text('Task remaining: ' + nToGo);
    }

    function menuCreate(n) {
        var menuItems = [],
            counter = 0,
            targetIndex = Math.floor((Math.random() * n)); //get a number from 0 to n-1 to be the index of the target
        while (counter < n) {
            // Randomly pick an item from the dictionary of any length.
            var item = dictionary[Math.floor((Math.random() * dictionary.length))];
 
            // Add the item only when it is already in the menuItems array.
            if (!menuItems.includes(item)) {
                menuItems[counter] = item;
                counter += 1;
            }//Repeat and pick an item again if it is already in the array.
        }
      
        targetText = menuItems[targetIndex];
        trialInfo.push(targetText);
        trialInfo.push(targetIndex);
      
        if (patternCurrent == 1) {
          menuCreatePattern1(menuItems, targetIndex, n);
        } else {
          menuCreatePattern2(menuItems, targetIndex, n);
        }

      // Enabling the button for the target menu item
//      $$('#menuItemTarget').on('click', function() {
//        trialEnd();
//      });
      $$('a.menuItem').on('click', function() {
        timeEnd = Date.now();
        trialDuration = timeEnd - timeStart;
        trialInfo.push(Number(this.attributes["data-item-position"].value));
        trialInfo.push(trialDuration);
        
        results[resultNth] = trialDuration; // This needs to be before incrementing resultNumber
        resultNth += 1; //every trial, error or correct
        
        var error;
        if(this.attributes["id"]) {
            error = 0;
            trialEnd();
        } else {
            error = 1;
        }
        trialInfo.push(error);
        experimentResult[resultNth] = trialInfo;
        trialInfo = [];
      });
    }
  
    function menuCreatePattern1(menuItems, targetIndex, n) {
      // Construction the unordered list (ul) for the menu based on Framework7's structure as follows:
//                   <li>
//                    <a class="item-link close-panel" href="forms.html">
//                        <div class="item-content">
//                            <div class="item-media">
//                                <i class="icon icon-f7"></i>
//                            </div>
//                            <div class="item-inner">
//                                <div class="item-title">Forms</div>
//                            </div>
//                        </div>
//                    </a>
//                    </li>
// 
        var ul = document.getElementById("navigationMenu");
        for (var i=0; i<n ;i++) {
            var li,
                a,
                itemContent,
                itemInner,
                itemTitle;
            
            li = document.createElement("li");
            a  = document.createElement("a");
            itemContent = document.createElement("div");
            itemContent.setAttribute("class", "item-content");
            itemInner = document.createElement("div");
            itemInner.setAttribute("class", "item-inner");
            itemTitle = document.createElement("div");
            itemTitle.setAttribute("class", "item-title");
            itemTitle.textContent = menuItems[i];
            if(i==targetIndex) {
                a.setAttribute("id", "menuItemTarget");
                a.setAttribute("href", "#correct");
            } else {
              a.setAttribute("href", "#incorrect");
            }
            a.setAttribute("class", "close-panel menuItem");
            a.setAttribute("data-item-position", i);
            itemInner.appendChild(itemTitle);
            itemContent.appendChild(itemInner);
            a.appendChild(itemContent);
            li.appendChild(a);
            ul.appendChild(li);
        }
      
    }
  
    function menuCreatePattern2(menuItems, targetIndex, n) {
      // Construction of tab bar based on the structure 
      var tabBar      = $$('#tabbar'),
          tabList     = [],
          moreTabMenu = $$('#moreTabList'),
          moreTabList = [];          
      
      // Assuming the menu items (menuItems[]) are always equal or greater than 5 
      for (var i=0; i<5; i++) {
        
        var tabHref = (i==targetIndex) ? 'href="#correctTab" id="menuItemTarget" ' : 'href="#incorrectTab" ';
        
        tabList.push( '<a ' + tabHref + 'class="tab-link menuItem" ' + 
                             'data-item-position=' + i + '>' +
                      '<i class="icon"></i>' +
                      '<span class="tabbar-label">' +
                      menuItems[i] +
                      '</span>' +
                      '</a>'
                    );
      }
      //Adding the 5th one "More"
      tabList.push( '<a href="#moreTab" class="tab-link">' +
                    '<i class="icon"></i>' +
                    '<span class="tabbar-label">' +
                    'More' +
                    '</span>' +
                    '</a>'
                    );
      
      tabBar.append(tabList.join(''));
      
      for (var i=5; i<n; i++) {
        
        var moreHref = (i==targetIndex) ? 'href="#correct" id="menuItemTarget" ' : 'href="#incorrect" ';
        
        moreTabList.push('<li>' +
                         '<a ' + moreHref + 'class="item-link menuItem" ' + 
                                'data-item-position=' + i + '>' +
                         '<div class="item-content">' +
                         '<div class="item-inner">' +
                         '<div class="item-title">' +
                         menuItems[i] +
                         '</div></div></div></a></li>'
                        );
      }
      moreTabMenu.append(moreTabList.join(''));
      
    }

    function targetDisplay() {
        var textElement = document.getElementById("targetText");
        textElement.textContent = "Find: " + targetText;
    }
    
    function targetRemove() {
        var textElement = document.getElementById("targetText");
        textElement.textContent = "";
    }
  
    // Public properties
    // none
    
    return experiment;
    
})(); //IIFE


