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
          entry.target.classList.add('show');
      } else {
          entry.target.classList.remove('show');
      }
  })
})




window.addEventListener('load', () => {
  const hiddenElements = document.querySelectorAll('.hidden');
  hiddenElements.forEach((el) => observer.observe(el));
});