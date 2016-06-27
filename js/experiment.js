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
        numberOfTrialCurrent = 0, // Current Nth trial
        numberOfTrials        = 10, // Number of repeats in one experiment. Vague. per block or the whole?
        resultNth = 0, // Current Nth Trial
        menuItemTarget,
        textTarget;
    
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
        while (counter < n) {
            // Randomly pick an item from the dictionary of any length.
            var item = dictionary[Math.floor((Math.random() * dictionary.length))];
            // Add the item only when it is already in the menuItems array.
            if (menuItems.includes(item) === false) {
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
            var li = document.createElement("li");
            var a  = document.createElement("a");
            var itemContent = document.createElement("div");
            itemContent.setAttribute("class", "item-content");
            var itemMedia = document.createElement("div");
            itemMedia.setAttribute("class", "item-media");
            var icon = document.createElement("i");
            icon.setAttribute("class", "icon icon-f7"); //<<<<<<This part needs to be changed to select icons dynamically
            var itemInner = document.createElement("div");
            itemInner.setAttribute("class", "item-inner");
            var itemTitle = document.createElement("div");
            itemTitle.setAttribute("class", "item-title");
            itemTitle.textContent = menuItems[i];
            if(i==targetIndex) {
                a.setAttribute("id", "menuItemTarget");
                textTarget = menuItems[i];
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
        var element = document.getElementById("targetDisplay");
        element.textContent = textTarget;
    }
    
    function targetRemove() {
        var element = document.getElementById("targetDisplay");
        element.textContent = "";
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


