/**
 * Handle the bot response from the server
 * @param response JSON object containing the response from the server
 */
function recieveBotReply(response: any) {
    if (response.status !== 'OK')
        throw new Error("Failed to recieve bot reply");

    displayMessage(response.message, false);
}

/**
 * idk
 */
function throwError() {
    throw new Error("Your micosoft got h4cked!!! SO CRINGE!");
}

/**
 * Append a message to the chat HTML element
 * @param message string of the message to display
 * @param sender  whether the message was sent by the user or the bot
 */
function displayMessage(message: string, isFromUser: boolean) {
    let cssClass = "";

    if (isFromUser)
        cssClass = "msg-user";
    else
        cssClass = "msg-bot";

    $('#message-log').append(
        `<div class="${cssClass}"><p>${message}</p></div>`
    );
}

/**
 * Package user message as JSON and send to Flask route
 * @param event 
 */
function handleChatboxSubmission(event: Event) {
    event.preventDefault();  // Prevent default form submission from browser
    let message = $('#chatbox-content').val();

    if (typeof(message) !== 'string')
        throw new Error("Message is not a string");

    displayMessage(message, true);
    $('#chatbox-content').val('');  // Clear message box

    // Send AJAX POST request to Flask route
    $.ajax({
        url: '/process-msg',
        method: 'POST',
        data: {message: message},
        dataType: 'json',
        success: recieveBotReply,
        error: throwError,
    })
}

function checkBotInit(response: any) {
    if (response.status !== 'OK')
        throw new Error("Failed to initialise bot");

    console.log(`SUCCESS: Bot initialised with id ${response.bot_id}`);
}

/**
 * Initialise event listeners etc when the window loads
 */
function main() {
    const chatbox = $('#chatbox')[0];
    chatbox.addEventListener('submit', handleChatboxSubmission);
    $.post("/init_chatbot").done(checkBotInit);
}

window.onload = main;