"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* ======================= EXPAND NAV ======================= */
/* Open the overlay when someone clicks on the hamburger menu */
function openNav() {
    const myNav = document.getElementById("myNav");
    if (myNav != null)
        myNav.style.width = "100%";
}
/* Close the overlay when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    const myNav = document.getElementById("myNav");
    if (myNav != null)
        myNav.style.width = "0%";
}
/* ======================= SCROLL FADE ======================= */
/* Shows elements as you scroll when they appear onscreen */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            console.log("show");
            entry.target.classList.add("show");
        }
        else {
            console.log("hide");
            entry.target.classList.remove("show");
        }
    });
});
window.addEventListener("load", () => {
    const hiddenElements = document.querySelectorAll(".hidden");
    hiddenElements.forEach((el) => observer.observe(el));
});
/* ======================= TYPEWRITER ======================= */
/* Function that simulates a typewriter writing the given text in the given element */
function typewriterWrite(element, text) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(text);
        const waitCharacter = 25;
        const characters = text.split("");
        let currentText = "";
        element.textContent = "";
        for (let i = 0; i < characters.length; i++) {
            yield new Promise((resolve) => setTimeout(resolve, waitCharacter));
            currentText += characters[i];
            element.textContent = currentText + '|';
        }
        element.textContent = currentText;
    });
}
/* Function that simulates a typewriter deleting the text in the given element */
function typeWriterRemove(element) {
    return __awaiter(this, void 0, void 0, function* () {
        const waitCharacter = 25;
        let textContent = element.textContent;
        if (textContent != null) {
            const characters = textContent.split("");
            for (let i = 0; i < characters.length; i++) {
                yield new Promise((resolve) => setTimeout(resolve, waitCharacter));
                textContent = textContent.slice(0, -1);
                element.textContent = textContent + "|";
            }
        }
        element.textContent = "";
    });
}
