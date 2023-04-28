/* Typewriter effect on title on screen load */
const sloganText = "Make Sparks Fly";
const bylineTexts = [
    "WE do something idk our website is very functionally cool",
    "I am and epic robot",
    "Why are you still looking at me"
];
let currentHeader = 0;
const waitTime = 8000;
let slogan;
let byline;

window.onload = async () => {
    slogan = document.getElementById("banner-slogan");
    byline = document.getElementById("banner-byline");
    byline.textContent = "";
    const wait = await typewriterWrite(slogan, sloganText);
    setTimeout(function(){typewriterWrite(byline, bylineTexts[0]).then(() => byline.style.display = "block")}, wait);
    setInterval(typePhrase, waitTime);   
}

async function typewriterWrite(element, text) {
  element.style.borderRight= "0.15em solid var(--gradient-colour-one)";
  console.log(text);
  const waitCharacter = 25;
  const characters = text.split("");
  element.textContent = "";

  for (let i = 0; i < characters.length; i++) {
    await new Promise(resolve => setTimeout(resolve, waitCharacter));
    element.textContent += characters[i];
  }

  element.style.borderRight = "none";
  return characters.length * waitCharacter;
}

async function typeWriterRemove(element) {
  element.style.borderRight= "0.15em solid var(--gradient-colour-one)";
  const waitCharacter = 25;
  const characters = element.textContent.split("");
  for (let i = 0; i < characters.length; i++) {
    await new Promise(resolve => setTimeout(resolve, waitCharacter));
    element.textContent = element.textContent.slice(0, -1);
  }
  element.style.borderRight = "none";
}

async function typePhrase() {
  currentHeader = (currentHeader + 1) % bylineTexts.length;
  await typeWriterRemove(byline);
  await typewriterWrite(byline, bylineTexts[currentHeader]);
}

