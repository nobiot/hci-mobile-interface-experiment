// Browser limitation
// array.includes(element) is not supported on all platforms (notably, IE and Edge do not).
// TODO
// - Random numbers
// - Remember the user
// - Count the trials
// - Save with User
// - Mix material and ios themes

var NOBexperiment = (function () {
    'use strict';
    
    //Object to be return to provide public properties to the caller
    var experiment = {},
    
    //properties   
        results = [],
        currentPattern,
        timeStart,
        timeEnd,
        numberOfMenuItems      = 10,  // default number of menu items displayed
        numberOfMenuCandiates  = 99, // 1-n menu items will be used to randomly generate the menu
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

    var numberOfTrialCurrent = 0, // Current Nth trial
        numberOfTrials        = 10, // Number of repeats in one experiment. Vague. per block or the whole?
        resultNth = 0, // Current Nth Trial
        menuItemTarget,
        targetText,
        targetIcon;

    $$( '#buttonStartPattern1' ).on('click', function () {
      trialStart();
      setPattern(1);
    });
  
    $$( '#buttonStartPattern2' ).on('click', function () {
      trialStart();
      setPattern(2);
    });
  
    var buttonStartTrial   = document.getElementById("buttonStartTrial").onclick = trialStart; 
    var buttonStart        = document.getElementById("buttonStart")
                                     .onclick = function(){timeStart = Date.now();}
    var biuttonStartTrialIncorrect = document.getElementById("buttonStartTrialIncorrect").onclick = trialStart;
  
    function setPattern(p) {
      currentPattern = p;
      var css = (p==1) ? 'css/framework7.material.min.css' : 'css/framework7.ios.min.css';
      $$( '#themeCSS' ).attr( 'href', css);
    }
  
    function trialStart() {
        trialReset();
        menuCreate(numberOfMenuItems);
        targetDisplay();
        //timeStart = Date.now();
    }
    
    function trialEnd() {
        timeEnd = Date.now();
        trialResultWrite();
        trialReset();
    }

    function trialReset() {
        var ul = document.getElementById("navigationMenu");
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
        targetRemove();
    }

    function trialResultWrite() {
        var resultDisplay = document.getElementById("resultDisplay"),
            p = document.createElement("p"),
            duration = timeEnd - timeStart;
        results[resultNth] = duration; // This needs to be before incrementing resultNumber
        resultNth += 1;
        resultDisplay.textContent = (duration/1000) + " seconds";
        //resultDisplay.appendChild(p);
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
                a.setAttribute("href", "#correctP1");
                targetText = menuItems[i];
            } else {
              a.setAttribute("href", "#incorrectP1");
            }
            itemInner.appendChild(itemTitle);
            itemContent.appendChild(itemInner);
            a.appendChild(itemContent);
            li.appendChild(a);
            ul.appendChild(li);
        }
        menuItemTarget = document.getElementById("menuItemTarget");
        menuItemTarget.onclick = trialEnd;
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
    experiment.getResults = function() {
        results[0] = 1;
        return results;
    }
    
    return experiment;
    
})(); //IIFE


