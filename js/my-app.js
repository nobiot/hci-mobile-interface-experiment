// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    domCache: true
});

var materialCSS = function() {
  $$('head').append('<link rel="stylesheet" href="css/framework7.material.min.css">');
}

var iOSCSS = function() {
  $$('head').append('<link rel="stylesheet" href="css/framework7.ios.min.css">');
}

materialCSS();
