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
        numberOfMenuItems      = 10, // default number of menu items
        dictionary = ["01", "02", "03", "04", "05",
                      "05", "06", "07", "08", "09",
                      "10", "11", "12", "13", "14"
                     ], // words taken from https://en.wikipedia.org/wiki/List_of_culinary_fruits
        icons       = ["fa fa-hand-o-up", "fa fa-wheelchair-alt", "fa fa-area-chart", "fa fa-bed", "fa fa-check-circle-o",
                       "fa fa-flask", "fa fa-folder-open-o", "fa fa-globe", "fa fa-hdd-o", "fa fa-hotel",
                       "fa fa-keyboard-o", "fa fa-mobile", "fa fa-recycle", "fa fa-search", "fa fa-space-shuttle"
                     ],
        numberOfTrialCurrent = 0, // Current Nth trial
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
        resultDisplay.textContent = duration + " milliseconds";
        //resultDisplay.appendChild(p);
    }

    function menuCreate(n) {
        var menuItems = [],
            counter = 0,
            targetIndex = Math.floor((Math.random() * n)); //get a number from 0 to n-1 to be the index of the target
        while (counter < n * 2) {// x2 because text (0 to n-1) and icon (n to n-1)
            // Randomly pick an item from the dictionary of any length.
            var item;
            // Below both texts and icons are separately chosen; they are not paired in a fixed way.
            if (counter < n) { // text: from index 0 to n-1
                item = dictionary[Math.floor((Math.random() * dictionary.length))];
            } else { // icon: from index n to n*2-1
                item = icons[Math.floor((Math.random() * icons.length))]  + " fa-fw"; // fixed width for fontawesome
            }
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


