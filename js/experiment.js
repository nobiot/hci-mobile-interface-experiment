// Browser limitation
// array.includes(element) is not supported on all platforms (notably, IE and Edge do not).

var timeStart,
    timeEnd,
    numberOfRepeatsCurrent = 0,
    numberOfRepeats        = 10, // number of repeats in one experiment. Vague. per block or the whole?
    results = [],
    numberOfMenuItems      = 8, // default number of menu items
    dictionary = ["Apple", "Orange", "Mango", "Açaí", "Ackee",
                  "Banana", "Batuan", "Caimito", "Cantaloupe", "Chinese olive",
                  "Date", "Durian", "Galia melon", "Grumichama", "Guava"
                ], // words taken from https://en.wikipedia.org/wiki/List_of_culinary_fruits
    resultNumber = 0;
function experiment () {
    'use strict';
    var buttonStart = document.getElementById("buttonStart"),
        menuItemTarget,
        textTarget;
        
    function targetRemove() {
        var element = document.getElementById("targetDisplay");
        element.textContent = "";
    }
    
    function experimentReset() {
        var ul = document.getElementById("navigationMenu");
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
        targetRemove();
    }

    function writeResult() {
        var resultDisplay = document.getElementById("resultDisplay"),
            p = document.createElement("p"),
            duration = timeEnd - timeStart;
        results[resultNumber] = duration; // This needs to be before incrementing resultNumber
        resultNumber += 1;
        p.textContent = "Result " + resultNumber + ": " + duration + " milliseconds";
        resultDisplay.appendChild(p);
    }

    function endTimer() {
        timeEnd = Date.now();
        writeResult();
        experimentReset();
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
        menuItemTarget.onclick = endTimer;
    }

    function targetDisplay() {
        var element = document.getElementById("targetDisplay");
        element.textContent = textTarget;
    }
    
    buttonStart.onclick = function experimentStart() {
        experimentReset();
        menuCreate(numberOfMenuItems);
        targetDisplay();
        timeStart = Date.now();
    }
    
    var buttonSave = document.getElementById("buttonSave");
    buttonSave.onclick = function saveResults() {
        results.push("error: 0");
        results.unshift("block: slide");
        results.unshift("P01");
        
        // Tried sending an object with key:value. Didn't work.
        if(results.length != 0){
            var req = new XMLHttpRequest();
            req.open("POST", "", false); // Syncronous call is deprecated. TODO
            req.send(results);
            console.log(req.responseText); 
        }else{
            alert("There is no result.");
        }
    }
}