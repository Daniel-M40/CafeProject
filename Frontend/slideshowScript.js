// Slideshow Code

var slideIndex = 1;
showSlides(slideIndex);

// ********************************************************************
// Summary - Increases or decreases the slide index which changes the slides
//
// Parameters - Index
//
// Return - 
//
// Created by - Daniel Moir
// ********************************************************************
function addSlides(index) {
    showSlides(slideIndex += index);
}

// ********************************************************************
// Summary - Gets the current slide index
//
// Parameters - Index
//
// Return - 
//
// Created by - Daniel Moir
// ********************************************************************
function currentSlide(index) {
    showSlides(slideIndex = index);
}

// ********************************************************************
// Summary - shows the slides on the page
//
// Parameters - Index
//
// Return - 
//
// Created by - Daniel Moir
// ********************************************************************
function showSlides(index) {
    var i = 0;
    var slides = document.getElementsByClassName("slide");
    var dots = document.getElementsByClassName("dot");

    // If the index is greater than the amount of slides it resets it back to one
    // and if it is less than 1 is makes the index the amount of slides
    if (index > slides.length) { slideIndex = 1 }
    if (index < 1) { slideIndex = slides.length }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}
