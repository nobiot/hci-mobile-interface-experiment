// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    domCache: true
});

// Theme CSS added with id=themeCSS, which is used to dynamically swap with material
$$('head').append('<link rel="stylesheet" id=themeCSS href="css/framework7.material.min.css">');
$$('head').append('<link rel="stylesheet" href="css/my-app.css">');