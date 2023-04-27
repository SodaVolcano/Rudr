/* Typewriter effect on title on screen load */

window.onload = ()  => {
    const slogan = document.getElementById("banner-slogan");
    const byline = document.getElementById("banner-byline");
    byline.style.display = "none";
    const wait = typewriter(slogan);
    console.log(wait);
    setTimeout(function(){typewriter(byline); byline.style.display = "block";}, wait);   
}