"use strict";

/* ======================= EXPAND NAV ======================= */
/* Open the overlay when someone clicks on the hamburger menu */
function openNav() {
    const myNav = document.getElementById("myNav");
    if (myNav != null) myNav.style.width = "100%";
}

/* Close the overlay when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    const myNav = document.getElementById("myNav");
    if (myNav != null) myNav.style.width = "0%";
}


/* ======================= SCROLL FADE ======================= */
/* Shows elements as you scroll when they appear onscreen */
document.addEventListener("DOMContentLoaded", function() {
  const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
          if (entry.isIntersecting) {
              entry.target.classList.add("show");
          }
          else {
              entry.target.classList.remove("show");
          }
      });
  });

  const hiddenElements = document.querySelectorAll(".hidden");
  hiddenElements.forEach((el) => observer.observe(el));
});


/* ======================= TYPEWRITER ======================= */
/* Function that simulates a typewriter writing the given text in the given element */
async function typewriterWrite(element : HTMLElement, text : string) {
    console.log(text);
    const waitCharacter = 25;
    const characters = text.split("");
    let currentText = "";
    element.textContent = "";
  
    for (let i = 0; i < characters.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, waitCharacter));
      currentText += characters[i];
      element.textContent = currentText + '|';      
    }
    element.textContent = currentText;
  }
  
  /* Function that simulates a typewriter deleting the text in the given element */
  async function typeWriterRemove(element : HTMLElement) {
    const waitCharacter = 25;
    let textContent = element.textContent;
    if (textContent != null) {
        const characters = textContent.split("");
        for (let i = 0; i < characters.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, waitCharacter));
          textContent = textContent.slice(0, -1);
          element.textContent = textContent + "|";
        }
    }
    element.textContent = "";
  }
