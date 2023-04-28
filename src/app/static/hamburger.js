"use strict";
/* Open the overlay when someone clicks on the hamburger menu */
$('.hamburger-menu')[0].addEventListener('click', function (event) {
    $('#overlay-nav')[0].style.width = "100%";
});
/* Close the overlay when someone clicks on the "x" symbol inside the overlay */
$('.closebtn')[0].addEventListener('click', function (event) {
    $('#overlay-nav')[0].style.width = "0%";
});
