function handleServerResponse(response: any) {
    if (response.status === 'OK') {
        // Update chat interface with new message
        $('#message-log').append(`<p>${response.message}</p>`);
        $('#chatbox-content').val('');  // Clear message box
    }
    else {
        // idk man
        alert("ERROR YOUR MICOSOFT GOT H4CKED!!!");
    }
}

function handle_error() {

}

/**
 * Package user input as JSON and send to Flask route
 * @param event 
 */
function handleChatboxSubmission(event: Event) {
    event.preventDefault();  // Prevent default form submission from browser
    let message = $('#chatbox-content').val();
    // Send AJAX POST request to Flask route
    $.ajax({
        url: '/chat',
        method: 'POST',
        data: {message: message},
        dataType: 'json',
        success: handleServerResponse,
        error: handle_error,
    })
}


/**
 * Initialise event listeners etc when the window loads
 */
function main() {
    const chatbox = $('#chatbox')[0];
    chatbox.addEventListener('submit', handleChatboxSubmission);
}

window.onload = main;