// Declare slogan and byline text and set the time interval for changing byline
const sloganText = "Make Sparks Fly";
const bylineTexts = [
  "Connecting Souls, Byte by Byte",
  "Embark on an Exquisite Turing Test of Love",
  "Connecting Hearts with Data-Driven Precision",
  "Enter the Data Matrix of Love",
  "From Binary to First Base"
];
const waitTime = 4000;

// Declare variables to hold the slogan and byline elements and the interval ID
let currentHeader = 0;
let slogan;
let byline;
let intervalId;

// When the window is loaded, initialize the slogan and byline elements
// and start typing the slogan and the first byline
window.onload = async () => {
  slogan = document.getElementById("banner-slogan");
  byline = document.getElementById("banner-byline");
  byline.textContent = "";
  const wait = await typewriterWrite(slogan, sloganText);
  setTimeout(function () {
    typewriterWrite(byline, bylineTexts[0]).then(
      () => (byline.style.display = "block")
    );
  }, wait);
  startTyping();
};

// Function that types the next byline in the list
async function typePhrase() {
  currentHeader = (currentHeader + 1) % bylineTexts.length;
  await typeWriterRemove(byline);
  await typewriterWrite(byline, bylineTexts[currentHeader]);
}

// Function that starts the interval to change the byline text
function startTyping() {
  intervalId = setInterval(typePhrase, waitTime);
}

// Function that stops the interval to change the byline text
function stopTyping() {
  clearInterval(intervalId);
}

// Listen for the visibilitychange event (when the page is hidden or shown)
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    // Stop the interval when the page is hidden
    stopTyping();
  } else {
    // Start the interval again when the page is visible
    startTyping();
  }
});
