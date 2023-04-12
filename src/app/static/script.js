"use strict";
/**
 * Recieve response from the server
 * @param response JSON object containing the response from the server
 */
function handleServerResponse(response) {
    if (response.status === 'OK')
        displayMessage(response.message, false);
    else
        handleError(); // idk man
}
/**
 * idk
 */
function handleError() {
    alert("Your micosoft got h4cked!!! SO CRINGE!");
}
/**
 * Append a message to the chat HTML element
 * @param message string of the message to display
 * @param sender  whether the message was sent by the user or the bot
 */
function displayMessage(message, isFromUser) {
    let cssClass = "";
    if (isFromUser)
        cssClass = "msg-user";
    else
        cssClass = "msg-bot";
    $('#message-log').append(`<div class="${cssClass}"><p>${message}</p></div>`);
}
/**
 * Package user message as JSON and send to Flask route
 * @param event
 */
function handleChatboxSubmission(event) {
    event.preventDefault(); // Prevent default form submission from browser
    let message = $('#chatbox-content').val();
    if (typeof (message) !== 'string')
        throw new Error("Message is not a string");
    displayMessage(message, true);
    $('#chatbox-content').val(''); // Clear message box
    // Send AJAX POST request to Flask route
    $.ajax({
        url: '/chat',
        method: 'POST',
        data: { message: message },
        dataType: 'json',
        success: handleServerResponse,
        error: handleError,
    });
}
/**
 * Initialise event listeners etc when the window loads
 */
function main() {
    const chatbox = $('#chatbox')[0];
    chatbox.addEventListener('submit', handleChatboxSubmission);
}
window.onload = main;
