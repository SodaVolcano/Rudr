window.onload = main;

let typingTimer: number;
const MAX_TYPING_DELAY = 10000;  // miliseconds
const messageQueue: string[] = [];
let typingDelay = MAX_TYPING_DELAY;      // miliseconds

let resizeTimeout: number | undefined;    // Timer for window resize event
let maxChatboxHeight: number = 227.5;   // Found by trial and error
let minChatboxHeight: number;   // Computed from CSS on load in main()

/**
 * Initialise event listeners etc when the window loads
 */
function main() {
    const computedStyle = window.getComputedStyle($('.chatbox-area')[0]);
    minChatboxHeight = parseFloat(computedStyle.height);

    $('#chatbox-submit')[0].addEventListener('click', QueueMessage);
    $('#chatbox-content')[0].addEventListener('keydown', function(event) {
        if (event.key === 'Enter')
            QueueMessage(event);
    });

    $.post("/init_chatbot").done(checkBotInit);

    // Reset timer when user types in chatbox
    // Timer is also reset when user presses submit
    $('#chatbox-content').on('keydown', resetTimer);

    $('#chatbox-content')[0].addEventListener('input', adjustHeight);
    $(window)[0].addEventListener('resize', delayWindowResize);
}

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
function adjustHeight(event: Event) {
    const chatboxArea = $('.chatbox-area')[0];
    const textarea: HTMLTextAreaElement = <HTMLTextAreaElement> $('#chatbox-content')[0];
    // Reset height - always adjust height from min height
    // This allows box to shrink when user deletes messages
    chatboxArea.style.height = minChatboxHeight + 'px';
    
    const computedStyle = window.getComputedStyle(chatboxArea);
    const height = parseFloat(computedStyle.height);

    // If at min height, textarea overflows, expand chatbox
    if (textarea.scrollHeight > textarea.clientHeight) {
        const newHeight = Math.min(
            height + textarea.scrollHeight - textarea.clientHeight, 
            maxChatboxHeight
        );
        chatboxArea.style.height = newHeight + 'px';
    }
}

/**
 * Handle the bot response from the server
 * @param response JSON object containing the response from the server
 */
function recieveBotReply(response: any) {
    if (response.status !== 'OK')
        throw new Error("Failed to recieve bot reply");

    console.log("recieved bot reply");
    // Display each message with a random delay - simulates bot typing
    let delay = (Math.floor(Math.random() * 10) + 1) * 50;
    for (let message of response.messages) {
        console.log(`Bot message delay: ${delay}`);
        setTimeout(displayMessage, delay, message, false)
        // Timeout is async so message order is not guaranteed, hence
        // Delay is added to the previous message's delay
        delay += (Math.floor(Math.random() * 10) + 1) * 50;
    }

}

function checkBotInit(response: any) {
    if (response.status !== 'OK')
        throw new Error("Failed to initialise bot");

    console.log(`SUCCESS: Bot initialised with id ${response.bot_id}`);
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

    $('#chat-history').append(
        `<div class="${cssClass}"><p>${message}</p></div>`
    );
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
        data: {messages: JSON.stringify(messageQueue)},
        dataType: 'json',
        success: recieveBotReply,
        error: function() {throw new Error("Failed to send messages to server")}
    })
    console.log(`message list sent to server ${messageQueue}}`);
    messageQueue.length = 0;
}

/**
 * Called when the user submits a message, queue it but don't send
 */
function QueueMessage(event: Event) {
    let message = $('#chatbox-content').val();

    if (typeof(message) !== 'string')
        throw new Error("Message is not a string");

    message = message.trim();
    if (message === '')   // Ignore empty strings
        return;

    displayMessage(message, true);
    $('#chatbox-content').val('');  // Clear message box

    messageQueue.push(message);
    console.log(`Message queued ${message}}`);

    resetTimer();
}

/**
 */
function resetTimer() {
    clearTimeout(typingTimer);
    // Exponentially dercrease the typing delay, models bot's attention span
    // If user spams messages, bot will respond instead of freezing
    typingDelay = MAX_TYPING_DELAY / (2 ** messageQueue.length - 1);
    typingTimer = setTimeout(sendQueuedMessages, typingDelay);
    console.log(`New typing delay: ${typingDelay}ms`);
}