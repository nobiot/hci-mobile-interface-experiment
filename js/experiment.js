// Browser limitation
// array.includes(element) is not supported on all platforms (notably, IE and Edge do not).

var NOBexperiment = (function () {
    'use strict';
    
    //Object to be return to provide public properties to the caller
    var experiment = {},
    
    // Private properties   
        results = [],
        timeStart,
        timeEnd,
        numberOfMenuItems      = 8, // default number of menu items
        dictionary = ["Apple", "Orange", "Mango", "Açaí", "Ackee",
                      "Banana", "Batuan", "Caimito", "Cantaloupe", "Chinese olive",
                      "Date", "Durian", "Galia melon", "Grumichama", "Guava"
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
    
    // Adding fontawesome to the web page
    // <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css">
    var link,
        head;
    link   =  document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", "../css/font-awesome.min.css");
    head = document.querySelector("head")
                       .appendChild(link);
    var buttonStart = document.getElementById("buttonStart").onclick = trialStart;
    // probably listener is better TODO
    
    function trialStart() {
        trialReset();
        menuCreate(numberOfMenuItems);
        targetDisplay();
        timeStart = Date.now();
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
        p.textContent = "Result " + resultNth + ": " + duration + " milliseconds";
        resultDisplay.appendChild(p);
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
                itemMedia,
                icon,
                itemInner,
                itemTitle;
            
            li = document.createElement("li");
            a  = document.createElement("a");
            itemContent = document.createElement("div");
            itemContent.setAttribute("class", "item-content");
            itemMedia = document.createElement("div");
            itemMedia.setAttribute("class", "item-media");
            icon = document.createElement("i");
            icon.setAttribute("class", menuItems[i+n]);
            itemInner = document.createElement("div");
            itemInner.setAttribute("class", "item-inner");
            itemTitle = document.createElement("div");
            itemTitle.setAttribute("class", "item-title");
            itemTitle.textContent = menuItems[i];
            if(i==targetIndex) {
                a.setAttribute("id", "menuItemTarget");
                targetText = menuItems[i];
                targetIcon = menuItems[i+n]; // icons are appended after the n texts, hence +n
            }
            itemInner.appendChild(itemTitle);
            itemMedia.appendChild(icon);
            itemContent.appendChild(itemMedia);
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
        textElement.textContent = targetText;
        var iconElement = document.getElementById("targetIcon");
        iconElement.setAttribute("class", targetIcon);
    }
    
    function targetRemove() {
        var textElement = document.getElementById("targetText");
        textElement.textContent = "";
        var iconElement = document.getElementById("targetIcon");
        iconElement.removeAttribute("class");
    }

//Temporarily here. Should be separated out for server communication.
    var buttonSave = document.getElementById("buttonSave");
    buttonSave.onclick = function saveResults() {

        var o = {
            participant: "P01",
            firstBlock: {mode: "side panel",
                         results: results,
                         error: 0},
            secondBlock: {mode: "tab bar",
                          results: results,
                          error: 0}
        }      

        if(results.length != 0){
            var req = new XMLHttpRequest();
            req.open("POST", "", false); // Syncronous call is deprecated. TODO
            req.send(JSON.stringify(o));
            console.log(req.responseText); 
        }else{
            alert("There is no result.");
        }
    }
    
    // Public properties
    experiment.getResults = function() {
        return results;
    }
    return experiment;
})(); //IFFE


