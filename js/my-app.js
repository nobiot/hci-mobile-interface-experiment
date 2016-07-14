// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

myApp.onPageInit('pattern-1-go', function(page) {
                 var buttonStart = document.getElementById("buttonStart").onclick = NOBexperiment.getFuncStart;
                 //probably listener is better TODO    
                 })
