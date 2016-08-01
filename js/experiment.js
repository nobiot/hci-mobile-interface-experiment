var NOBexperiment = (function () {
    'use strict';
    
    //Object to be return to provide public properties to the caller
    var experiment = {},
        
    // parameters that can / should be changed 
        numberOfMenuItems      = 10,  // default number of menu items displayed
        numberOfMenuCandiates  = 99, // 1-n menu items will be used to randomly generate the menu
        numberOfTrials       = 1, // Number of repeats in one pattern
        message1 = "Please complete questionnaire 1 before you continue.",
        message2 = "Please complete questionnaire 2.",
        title1 = 'Confirm',
        title2 = 'Confirm',
    
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
    
    function saveExperiment() {
        if(results.length != 0){
            var req = new XMLHttpRequest();
            req.open("POST", "", false); // Syncronous call is deprecated. TODO
            req.send(JSON.stringify(experimentResult));
            console.log(req.responseText); 
          
            myApp.alert(message2, title2);
        }else{
            // You cannot be here.
        }
    }

    function patternSetCSS() {
        var css = (patternCurrent==1) ? 'css/framework7.material.min.css' : 'css/framework7.ios.min.css';
        $$( '#themeCSS' ).attr('href', css);
    }
  
    function patternSet(p) {
      patternCurrent = p;      
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
        href = "#";
        button.once('click', patternEndMessage);
      } else {
        text = "Finish" ;
        href = "#";
        button.once('click', saveExperiment); // probably this one should accept a callback to pop up confirmation
        $$('#thankYouPageText').text('Experient complete.');
      }
      button.text(text);
      button.attr('href', href);
    }
        
    function patternEndMessage() {
        myApp.alert(message1, title1, function () {
           mainView.router.load({pageName: 'Go'}); 
        });
      }
  
    function trialStart() {
        patternSetCSS();
        trialInfo = [];
        trialInfo.push(participant.number);
        trialInfo.push(patternCurrent);
        trialReset();
        menuCreate(numberOfMenuItems);
        targetDisplay();
        trialsToGO();
    }
    
    function trialEnd() {
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
    }
  
    function trialsToGO() {
      var nToGo = numberOfTrials - numberOfTrialCurrent;
      $$('#trialsToGo').text('Task remaining: ' + nToGo);
    }

    function menuCreate(n) {
        var menuItems = [],
            counter = 0,
            // get a number from 1 to n-1 to be the index of the target
            // the target cannot be 0 because that is the "current page"
            // logic from here: 
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
            // Returns a random integer between min (included) and max (excluded)
            targetIndex = Math.floor(Math.random() * (n - 1)) + 1; 
        while (counter < n) {
            // Randomly pick an item from the dictionary of any length.
            var item = dictionary[Math.floor((Math.random() * dictionary.length))];
 
            // Add the item only when it is already in the menuItems array.
            if (!menuItems.includes(item)) {
                menuItems[counter] = item;
                counter += 1;
            }//Repeat and pick an item again if it is already in the array.
        }
      
        // nav-bar's text
        $$(".current-page-text").text(menuItems[0]);
        
        targetText = menuItems[targetIndex];
        trialInfo.push(targetText);
        trialInfo.push(targetIndex);
      
        if (patternCurrent == 1) {
          menuCreatePattern1(menuItems, targetIndex, n);
        } else {
          menuCreatePattern2(menuItems, targetIndex, n);
        }

      $$('a.menuItem').on('click', function() {
        timeEnd = Date.now();
        trialDuration = timeEnd - timeStart;
        trialInfo.push(Number(this.attributes["data-item-position"].value));
        trialInfo.push(trialDuration);
          
        mainView.hideNavbar();  
        mainView.hideToolbar();
        
        trialReset();
        
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
        
        var ul = document.getElementById("navigationMenu");
        // i=0 is the current page > special treatment
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
                a.setAttribute("class", "item-link close-panel menuItem");
            } else if (i==0) {
              a.setAttribute("href", "#"); // Just close the menu by the class "close-panel"
              a.setAttribute("class", "item-link:active close-panel");
            } else {
              a.setAttribute("href", "#incorrect");
              a.setAttribute("class", "item-link close-panel menuItem");  
            }
            
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
      // i=0 is the current page
      for (var i=0; i<5; i++) {
        
        var tabHref;
        var tabClass;
        if (i==targetIndex) {
          tabHref = 'href="#correctTab" id="menuItemTarget" ';
            tabClass = 'class="menuItem ';
        } else if (i==0) {
          tabHref = 'href="#defaultTab" ';
          tabClass = 'class="active ';
        } else {
          tabHref  = 'href="#incorrectTab"  ';
          tabClass = 'class="menuItem menuItemIncorrect inactive '; // not closing it
        }
        tabClass += 'tab-link" '
        
        tabList.push( '<a ' + tabHref +  tabClass + 
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
        
        var moreHref;
        if (i==targetIndex) {
          moreHref = 'href="#correct" id="menuItemTarget" ';  
        } else {
          moreHref = 'href="#incorrect" ';
        }
        
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


