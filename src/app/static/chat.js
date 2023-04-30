"use strict";
window.onload = main;
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
// Controls whether the scrollbar should be scrolled to the bottom
// If user scrolled up, don't scroll down when new messages arrive
let scrolledUp = false;
/**
 * Initialise event listeners etc when the window loads
 */
function main() {
    const computedStyle = window.getComputedStyle($('.chatbox-area')[0]);
    minChatboxHeight = parseFloat(computedStyle.height);
    $('#chatbox-submit')[0].addEventListener('click', QueueMessage);
    $('#chatbox-content')[0].addEventListener('keydown', function (event) {
        if (event.key === 'Enter')
            QueueMessage(event);
    });
    $('#new-chat')[0].addEventListener('click', newChat);
    $.get("/get_conversations").done(displayConversations);
    // Reset timer when user types in chatbox
    // Timer is also reset when user presses submit
    $('#chatbox-content').on('keydown', resetTimer);
    $('#chatbox-content')[0].addEventListener('input', adjustHeight);
    $(window)[0].addEventListener('resize', delayWindowResize);
    // Prevent newline when ENTER is not pressed with SHIFT
    $('#chatbox-content').on('keydown', function (event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            adjustHeight(event);
        }
    });
    // Scrollbar - scroll to bottom if user hasn't scrolled up
    $('#chat-scrollbar')[0].addEventListener('scroll', function (event) {
        const scrollbar = event.target;
        if (scrollbar.scrollTop !== scrollbar.scrollHeight - scrollbar.clientHeight)
            scrolledUp = true;
        else
            scrolledUp = false;
    });
}
function checkConversationInit(response) {
    if (response.status !== 'OK')
        throw new Error("Failed to initialise conversation");
    console.log(`SUCCESS: Conversation initialised with id ${response.conversation_id}`);
}
/**
 * Get a list of conversations from the user, and display it in the unorderd list on the chat.html page
 */
function displayConversations(response) {
    if (response.status != 'EMPTY') {
        console.log("Printing Conversations");
        let all_conversations = response.conversations;
        // Loop through each conversation
        for (let conversation in all_conversations) {
            if (all_conversations.hasOwnProperty(conversation)) {
                console.log(conversation + ': ' + all_conversations[conversation]);
                // if value is another dictionary, iterate through it
                for (let id in all_conversations[conversation]) {
                    if (all_conversations[conversation].hasOwnProperty(id)) {
                        console.log('  ' + id + ': ' + all_conversations[conversation][id]);
                    }
                }
            }
            // get conversation and add it to the ul list on /chat
        }
    }
}
function newChat() {
    $.post("/init_chatbot").done(checkBotInit);
    $.post("/init_conversation").done(checkConversationInit);
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
    const chatboxArea = $('.chatbox-area')[0];
    const textarea = $('#chatbox-content')[0];
    // Reset height - always adjust height from min height
    // This allows box to shrink when user deletes messages
    chatboxArea.style.height = minChatboxHeight + 'px';
    const computedStyle = window.getComputedStyle(chatboxArea);
    const height = parseFloat(computedStyle.height);
    // If at min height, textarea overflows, expand chatbox
    if (textarea.scrollHeight > textarea.clientHeight) {
        const newHeight = Math.min(height + textarea.scrollHeight - textarea.clientHeight, maxChatboxHeight);
        chatboxArea.style.height = newHeight + 'px';
    }
}
// ================ submit/recieve message from server ===================
/**
 * Handle the bot response from the server
 * @param response JSON object containing the response from the server
 */
function recieveBotReply(response) {
    if (response.status !== 'OK')
        throw new Error("Failed to recieve bot reply");
    console.log("recieved bot reply");
    // Display each message with a random delay - simulates bot typing
    let delay = (Math.floor(Math.random() * 10) + 1) * 50;
    for (let message of response.messages) {
        console.log(`Bot message delay: ${delay}`);
        setTimeout(displayMessage, delay, message, false);
        // Timeout is async so message order is not guaranteed, hence
        // Delay is added to the previous message's delay
        delay += (Math.floor(Math.random() * 10) + 1) * 50;
    }
}
function checkBotInit(response) {
    if (response.status !== 'OK')
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
        url: '/process-msg',
        method: 'POST',
        data: { messages: JSON.stringify(messageQueue) },
        dataType: 'json',
        success: recieveBotReply,
        error: function () { throw new Error("Failed to send messages to server"); }
    });
    console.log(`message list sent to server ${messageQueue}}`);
    messageQueue.length = 0;
}
/**
 * Called when the user submits a message, queue it but don't send
 */
function QueueMessage(event) {
    let message = $('#chatbox-content').val();
    if (typeof (message) !== 'string')
        throw new Error("Message is not a string");
    message = message.trim();
    if (message === '') // Ignore empty strings
        return;
    displayMessage(message, true);
    $('#chatbox-content').val(''); // Clear message box
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
    let cssClass = "";
    if (isFromUser)
        cssClass = "msg-user-wrapper";
    else
        cssClass = "msg-bot-wrapper";
    $('#chat-history').append(`<div class="${cssClass}"><div class="speech-bubble"><p>${message}</p></div></div>`);
    if (!scrolledUp)
        $('#chat-scrollbar')[0].scrollTop = $('.scrollbar')[0].scrollHeight;
}
