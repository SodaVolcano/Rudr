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
document.addEventListener("DOMContentLoaded", main);
// ======================== global variables ========================
// When timer expires, send queued messages to server. reset on each input
let typingTimer;
const MAX_TYPING_DELAY = 5000; // miliseconds
let typingDelay = MAX_TYPING_DELAY; // miliseconds, gradually decreases
const messageQueue = [];
// Timer for window resize, delay to allow bootstrap to adjust
let resizeTimeout;
let maxChatboxHeight = 227.5; // Found by trial and error
let minChatboxHeight; // Computed from CSS on load in main()
// current conversation id
let currentConversationID = "";
// Controls whether the scrollbar should be scrolled to the bottom
// If user scrolled up, don't scroll down when new messages arrive
let scrolledUp = false;
// Image sources
/* https://dribbble.com/shots/14503125-Robot-Avatar-Icons */
const imageSources = [
    "/static/robot_icons/rob1.png",
    "/static/robot_icons/rob2.png",
    "/static/robot_icons/rob3.png",
    "/static/robot_icons/rob4.png",
    "/static/robot_icons/rob5.png",
    "/static/robot_icons/rob6.png",
    "/static/robot_icons/rob7.png",
    "/static/robot_icons/rob8.png",
    "/static/robot_icons/rob9.png",
    "/static/robot_icons/rob10.png",
    "/static/robot_icons/rob11.png",
    "/static/robot_icons/rob12.png",
    "/static/robot_icons/rob13.png",
    "/static/robot_icons/rob14.png",
    "/static/robot_icons/rob15.png",
    "/static/robot_icons/rob16.png",
    "/static/robot_icons/rob17.png",
    "/static/robot_icons/rob18.png",
    "/static/robot_icons/rob19.png",
    "/static/robot_icons/rob20.png"
];
/**
 * Initialise event listeners etc when the window loads
 */
function main() {
    const computedStyle = window.getComputedStyle($(".chatbox-area")[0]);
    minChatboxHeight = parseFloat(computedStyle.height);
    const underChatbox = document.getElementById("under-chatbox");
    if (underChatbox != null)
        underChatbox.style.height = minChatboxHeight + "px";
    $("#chatbox-submit")[0].addEventListener("click", QueueMessage);
    $("#chatbox-content")[0].addEventListener("keydown", function (event) {
        if (event.key === "Enter")
            QueueMessage(event);
    });
    $("#new-chat")[0].addEventListener("click", newChat);
    $.get("/get_conversations").done(displayConversations);
    // Reset timer when user types in chatbox
    // Timer is also reset when user presses submit
    $("#chatbox-content").on("keydown", resetTimer);
    $("#chatbox-content")[0].addEventListener("input", adjustHeight);
    $(window)[0].addEventListener("resize", delayWindowResize);
    // Prevent newline when ENTER is not pressed with SHIFT
    $("#chatbox-content").on("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
        }
    });
    // Scrollbar
    $(".scrollbar")[0].addEventListener("scroll", function (event) {
        const scrollbar = event.target;
        scrolledUp = !(scrollbar.scrollTop + scrollbar.clientHeight >=
            scrollbar.scrollHeight - 1);
    });
    // No Conversation
}
// ================== conversation init and switiching ====================
function checkConversationInit(response) {
    if (response.status !== "OK")
        throw new Error("Failed to initialise conversation");
    currentConversationID = response.conversation_id;
    console.log(`SUCCESS: Conversation initialised with id ${response.conversation_id}`);
}
/**
 * Get a list of conversations from the user, and display it in the unorderd list on the chat.html page
 */
function displayConversations(response) {
    const conversationList = document.getElementById("conversations");
    if (conversationList == null || response.status == "EMPTY") {
        return;
    }
    console.log("Printing Conversations");
    const all_conversations = response.conversations;
    // Loop through each conversation
    for (let i = 0; i < all_conversations.length; i++) {
        const current = all_conversations[i].toString();
        console.log(current);
        // get conversation and add it to the ul list on /chat
        const div = document.createElement("div");
        const img = document.createElement("img");
        img.src = imageSources[parseInt(current) % imageSources.length];
        img.alt = current;
        const hue = (parseInt(current)) % 360;
        img.style.filter = `hue-rotate(${hue}deg)`;
        div.appendChild(img);
        const name = document.createElement("h5");
        name.textContent = current; // Change with Robot Name
        div.appendChild(name);
        div.classList.add("conversation-container");
        div.setAttribute("id", current);
        div.addEventListener("click", () => {
            changeConversation(current);
        });
        conversationList.appendChild(div);
    }
}
function receiveConversation(response) {
    if (response.status !== "OK")
        throw new Error("Failed to initialise conversation");
    // replace current conversation messages with the given ones
    console.log(`SUCCESS: New Conversation initialised with id ${response.conversation_id}`);
    currentConversationID = response.conversation_id;
    clearConversation();
    for (let i = 0; i < response.conversation.length; i++) {
        // check if from robot or user
        let isFromUser = true;
        console.log(response.conversation[i].speaker);
        if (response.conversation[i].speaker == "robot") {
            isFromUser = false;
        }
        console.log(response.conversation[i].content);
        reDisplayMessage(response.conversation[i].content, isFromUser);
    }
}
function changeConversation(conversation_id) {
    sendQueuedMessages();
    resetTimer();
    const prevSelected = document.getElementsByClassName("selected");
    for (let i = 0; i < prevSelected.length; i++) {
        prevSelected[i].classList.remove("selected");
    }
    const newSelected = document.getElementById(conversation_id);
    newSelected === null || newSelected === void 0 ? void 0 : newSelected.classList.add("selected");
    $.ajax({
        url: "/replace_conversation",
        method: "GET",
        data: { new_id: JSON.stringify(conversation_id) },
        dataType: "json",
        success: receiveConversation,
        error: function () {
            throw new Error("Failed to change conversation");
        },
    });
}
function clearConversation() {
    let chatHistory = document.getElementById("chat-history");
    if (chatHistory != null) {
        while (chatHistory.firstChild) {
            chatHistory.firstChild.remove();
        }
    }
}
function newChat() {
    $.post("/init_chatbot").done(checkBotInit);
    $.post("/init_conversation").done(checkConversationInit);
    console.log("clearing chat");
    clearConversation();
}
// ======================== textarea resizing ========================
/**
 * Delay the window resize event so it's run after bootstrap adjustment
 * Without this, chatbox is resized but then bootstrap readjust, making
 * it appear like the resize function didn't happen
 */
function delayWindowResize() {
    // Clear existing timeout to avoid multiple resizes
    if (resizeTimeout)
        clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(adjustHeight, 20);
}
/**
 * Adjust height of the chatbox
 */
function adjustHeight(event) {
    const underChatbox = document.getElementById("under-chatbox");
    const chatboxArea = $(".chatbox-area")[0];
    const textarea = ($("#chatbox-content")[0]);
    // Reset height - always adjust height from min height
    // This allows box to shrink when user deletes messages
    chatboxArea.style.height = minChatboxHeight + "px";
    const computedStyle = window.getComputedStyle(chatboxArea);
    const height = parseFloat(computedStyle.height);
    // If at min height, textarea overflows, expand chatbox
    if (textarea.scrollHeight > textarea.clientHeight) {
        const newHeight = Math.min(height + textarea.scrollHeight - textarea.clientHeight, maxChatboxHeight);
        chatboxArea.style.height = newHeight + "px";
        if (underChatbox != null)
            underChatbox.style.height = newHeight + "px";
    }
}
// ================ submit/recieve message from server ===================
/**
 * Handle the bot response from the server
 * @param response JSON object containing the response from the server
 */
function delay(duration) {
    return new Promise(function (resolve) {
        setTimeout(resolve, duration);
    });
}
function recieveBotReply(response) {
    return __awaiter(this, void 0, void 0, function* () {
        if (response.status !== "OK")
            throw new Error("Failed to recieve bot reply");
        if (response.messages_conversation_id != currentConversationID)
            throw new Error("Messages are from another conversation");
        console.log("recieved bot reply");
        for (let message of response.messages) {
            yield displayMessage(message, false);
        }
    });
}
function checkBotInit(response) {
    if (response.status !== "OK")
        throw new Error("Failed to initialise bot");
    console.log(`SUCCESS: Bot initialised with id ${response.bot_id}`);
}
/**
 * Package user messages as JSON and send to Flask route
 * @param event
 */
function sendQueuedMessages() {
    if (messageQueue.length === 0)
        return;
    // Send AJAX POST request to Flask route
    $.ajax({
        url: "/process-msg",
        method: "POST",
        data: {
            messages: JSON.stringify(messageQueue),
            conversation_id: currentConversationID,
        },
        dataType: "json",
        success: recieveBotReply,
        error: function () {
            throw new Error("Failed to send messages to server");
        },
    });
    console.log(`message list sent to server ${messageQueue}}`);
    messageQueue.length = 0;
}
/**
 * Called when the user submits a message, queue it but don't send
 */
function QueueMessage(event) {
    let message = $("#chatbox-content").val();
    if (typeof message !== "string")
        throw new Error("Message is not a string");
    message = message.trim();
    if (message === "")
        // Ignore empty strings
        return;
    reDisplayMessage(message, true);
    $("#chatbox-content").val(""); // Clear message box
    messageQueue.push(message);
    console.log(`Message queued ${message}}`);
    resetTimer();
}
/**
 * Reset the typing timer
 */
function resetTimer() {
    clearTimeout(typingTimer);
    // Exponentially dercrease the typing delay, models bot's attention span
    // If user spams messages, bot will respond instead of freezing
    typingDelay = MAX_TYPING_DELAY / (2 ** messageQueue.length - 1);
    typingTimer = setTimeout(sendQueuedMessages, typingDelay);
    console.log(`New typing delay: ${typingDelay}ms`);
}
// ======================== chat history ========================
/**
 * Append a message to the chat HTML element
 * @param message string of the message to display
 * @param sender  whether the message was sent by the user or the bot
 */
function displayMessage(message, isFromUser) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
            const cssClass = isFromUser ? "msg-user-wrapper" : "msg-bot-wrapper";
            if (isFromUser) {
                $(".chat-history").append(`<div class="${cssClass}"><div class="speech-bubble"><p>${message}</p></div></div>`);
            }
            else {
                $(".chat-history").append(`<div class="${cssClass}"><div class="speech-bubble"><p id="new-message"></p></div></div>`);
            }
            if (!scrolledUp) {
                $(".scrollbar")[0].scrollTop = $(".scrollbar")[0].scrollHeight;
            }
            if (!isFromUser) {
                const newMessage = document.getElementById("new-message");
                if (newMessage != null) {
                    console.log("sdajdhajsdk");
                    console.log(message);
                    yield typewriterWrite(newMessage, message);
                    newMessage.removeAttribute("id");
                }
            }
            resolve();
        }));
    });
}
/**
 * Append a message to the chat HTML element, but without the typewriter effect for switching between conversations
 * @param message string of the message to display
 * @param sender  whether the message was sent by the user or the bot
 */
function reDisplayMessage(message, isFromUser) {
    const cssClass = isFromUser ? "msg-user-wrapper" : "msg-bot-wrapper";
    $(".chat-history").append(`<div id="msg" class="${cssClass}"><div class="speech-bubble"><p>${message}</p></div></div>`);
    if (!scrolledUp) {
        $(".scrollbar")[0].scrollTop = $(".scrollbar")[0].scrollHeight;
    }
}
