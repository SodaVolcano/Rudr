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


/* Typewriter effect for text */

function typewriter(element) {
  console.log(element.textContent);
  const waitCharacter = 25;
  const characters = element.textContent.split("");
  element.textContent = "";

  // Loop through each character and add it to the text element
  characters.forEach((character, index) => {
    setTimeout(() => {
      element.textContent += character;
    }, waitCharacter * index);
  });

  // Set a timeout to remove the border after all characters have been added
  setTimeout(() => {
    element.style.borderRight = "none";
  }, waitCharacter * characters.length);

  return characters.length * waitCharacter;
}




