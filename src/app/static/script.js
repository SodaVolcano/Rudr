"use strict";
function handleServerResponse(response) {
    if (response.status === 'OK') {
        // Update chat interface with new message
        $('#message-log').append(`<p>${response.message}</p>`);
        $('#chatbox-content').val(''); // Clear message box
    }
    else {
        // idk man
        handleError();
    }
}
function handleError() {
    alert("Your micosoft got h4cked!!! SO CRINGE!");
}
/**
 * Package user input as JSON and send to Flask route
 * @param event
 */
function handleChatboxSubmission(event) {
    event.preventDefault(); // Prevent default form submission from browser
    let message = $('#chatbox-content').val();
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
