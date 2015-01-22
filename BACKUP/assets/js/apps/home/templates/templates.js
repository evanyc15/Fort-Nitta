define(["text!js/apps/home/templates/home_layout.html",  
        "text!js/apps/home/templates/home_loginBox.html",
        "text!js/apps/home/templates/home_signupBox.html", 
        "text!js/apps/home/templates/home_about.html"],
        function (layout, loginBox, signupBox, about) {
    "use strict";

    return {
        "layout": layout,
        "loginBox": loginBox,
        "signupBox": signupBox,
        "about": about
    }
});