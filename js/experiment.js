function addElement() {
  // create a new div element
  // and give it some content
    var li = document.createElement("li");
    var a = document.createElement("a");
    var text = document.createTextNode("Hi there and greetings!");
    a.appendChild(text);
    li.appendChild(a); //add the text node to the newly created div. 
  // add the newly created element and its content into the DOM 
    var ul = document.getElementById("navigationMenu");
    ul.appendChild(li);
    alert("added");
}

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
    var menuItemTarget = document.getElementById("menuItemTarget");
     

    function menuCreate(n) {
        var menuItems = [n];
        var targetIndex = Math.floor((Math.random() * n-1)) //get a number between 0 and-1 n to be the index of the target
        for (var i = 0; i < n; i++){ // get n items 
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
        menuItems.forEach(function(item) {
            var li = document.createElement("li");
            var a  = document.createElement("a");
            a.innerHTML = item;
            li.appendChild(a);
            ul.appendChild(li);
        });
        // Randomly determine the target
    }
    
    function targetDisplay() {
        
    }

    function buttonToggleOff() {
        //TODO
    }
    
    function reset() {
        var ul = document.getElementById("navigationMenu");
        while(ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
    }
    
    function writeResult() {
        var resultArea = document.getElementById("resultArea");
        var p = document.createElement("p")
        var duration = timeEnd - timeStart;
        p.innerHTML = "Result: " + duration + " milliseconds";
        resultArea.appendChild(p);
    }

    buttonStart.onclick = function experimentStart() {
        menuCreate(numberOfMenuItems);
        targetDisplay()
        timeStart = Date.now();
        buttonToggleOff();
    }
    
    menuItemTarget.onclick = function endTimer() {
        timeEnd = Date.now();
        writeResult();
        reset();
    }
}