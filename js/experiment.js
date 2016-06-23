// Browser limitation
// array.includes(element) is not supported on all platforms (notably, IE and Edge do not).

window.onload = function () {
    
    var timeStart;
    var tiemEnd;

    var numberOfMenuItems = 8; // default number of menu items
    var dictionary = ["Apple", "Orange", "Mango", "Açaí", "Ackee",
                      "Banana", "Batuan", "Caimito", "Cantaloupe", "Chinese olive",
                      "Date", "Durian", "Galia melon", "Grumichama", "Guava"
                    ]; // words taken from https://en.wikipedia.org/wiki/List_of_culinary_fruits
    

    var buttonStart = document.getElementById("buttonStart");
    var menuItemTarget;
    var textTarget;
    var resultNumber = 0;
     
    function endTimer() {
            timeEnd = Date.now();
            writeResult();
            experimentReset();
    }
    function menuCreate(n) {
        var menuItems = [n];
        var targetIndex = Math.floor((Math.random() * (n - 1) )) //get a number between 0 and n-1 to be the index of the target
        for (var i=0; i < n; i++){ // get n items 
            var item = dictionary[Math.floor((Math.random() * dictionary.length))]; // generate random to length of the dictionary
            
            if (menuItems.includes(item) == false){ // check if the item is already in the chosen one
                menuItems[i] = item;
            }else{
                i--; //if the item is already in the array, then the loop needs repeat the
                     //same iteration
                     //come back to this. very ugly solution
            }
        }
        // Create <li> elements
        var ul = document.getElementById("navigationMenu");
        
        for (var i=0; i<n ;i++) {
            var li = document.createElement("li");
            var a  = document.createElement("a");
            a.innerHTML = menuItems[i];
            if(i==targetIndex) {
                a.setAttribute("id", "menuItemTarget");
                textTarget = menuItems[i];
            }
            li.appendChild(a);
            ul.appendChild(li);
        }
        menuItemTarget = document.getElementById("menuItemTarget");
        menuItemTarget.onclick = endTimer;
    }
    
    function targetDisplay() {
        var element = document.getElementById("targetDisplay");
        element.innerHTML = textTarget;
    }
    function targetRemove() {
        var element = document.getElementById("targetDisplay");
        element.innerHTML = "";
    }
    
    function experimentReset() {
        var ul = document.getElementById("navigationMenu");
        while(ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
        targetRemove();
    }
    
    function writeResult() {
        resultNumber += 1;
        var resultDisplay = document.getElementById("resultDisplay");
        var p = document.createElement("p")
        var duration = timeEnd - timeStart;
        p.innerHTML = "Result " + resultNumber + ": " + duration + " milliseconds";
        resultDisplay.appendChild(p);
    }

    buttonStart.onclick = function experimentStart() {
        experimentReset();
        menuCreate(numberOfMenuItems);
        targetDisplay()
        timeStart = Date.now();
    }
}