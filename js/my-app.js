// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

//var viewP1 = myApp.addView('.view-p1', {
//    // Because we use fixed-through navbar we can enable dynamic navbar
//    dynamicNavbar: true
//});