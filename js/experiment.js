function addElement() {
  // create a new div element
  // and give it some content
    var li = document.createElement("li");
    var a = document.createElement("a")
    var text = document.createTextNode("Hi there and greetings!");
    a.appendChild(text);
    li.appendChild(a); //add the text node to the newly created div. 
  // add the newly created element and its content into the DOM 
    var ul = document.getElementById("list");
    ul.appendChild(li);
    alert("added");
}

var numberOfMenuItems = 5; // default number of menu items
var dictionary["Apple", "Orange", "Mango", "Açaí", "Ackee",
               "Banana", "Batuan", "Caimito", "Cantaloupe", "Chinese olive",
               "Date", "Durian", "Galia melon", "Grumichama", "Guava"
              ]; // words taken from https://en.wikipedia.org/wiki/List_of_culinary_fruits

function createMenu(n){
    readDictionary(n);
    
}

function startTimer(){
    
}


function toggleButtonOff(){
    
}

function experimentStart(){
    createMenu(numberOfMenuItems);
    startTimer();
    toggleButtonOff();
}