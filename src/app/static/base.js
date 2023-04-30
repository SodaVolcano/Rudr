"use strict";

/* Open the overlay when someone clicks on the hamburger menu */
function openNav() {
  document.getElementById("myNav").style.width = "100%";
}

/* Close the overlay when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

/* Shows elements as you scroll when they appear onscreen */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
});

window.addEventListener("load", () => {
  const hiddenElements = document.querySelectorAll(".hidden");
  hiddenElements.forEach((el) => observer.observe(el));
});

/* ======================= TYPEWRITER ======================= */

// Function that simulates a typewriter writing the given text in the given element
async function typewriterWrite(element, text) {
    element.style.borderRight = "0.15em solid var(--gradient-colour-one)";
    console.log(text);
    const waitCharacter = 25;
    const characters = text.split("");
    element.textContent = "";
  
    for (let i = 0; i < characters.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, waitCharacter));
      element.textContent += characters[i];
    }
  
    element.style.borderRight = "none";
  }
  
  // Function that simulates a typewriter deleting the text in the given element
  async function typeWriterRemove(element) {
    element.style.borderRight = "0.15em solid var(--gradient-colour-one)";
    const waitCharacter = 25;
    const characters = element.textContent.split("");
    for (let i = 0; i < characters.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, waitCharacter));
      element.textContent = element.textContent.slice(0, -1);
    }
    element.style.borderRight = "none";
  }
