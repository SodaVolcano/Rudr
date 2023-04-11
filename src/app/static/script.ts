function sucessful(response: any) {
    if (response.status === 'OK') {
        // Update chat interface with new message
        $('#message-log').append(`<p>${response.message}</p>`);
        $('#chatbox-content').val('');  // Clear message box
    }
    else {
        // idk man
    }
}

function handle_error() {

}

function handle_message(event: Event) {
    event.preventDefault();  // Prevent default form submission from browser
    let message = $('#chatbox-content').val();
    // Send AJAX POST request to Flask route
    $.ajax({
        url: '/chat',
        method: 'POST',
        data: {message: message},
        dataType: 'json',
        success: sucessful,
        error: handle_error,
    })
}


function main() {
    const chatbox = $('#chatbox')[0];
    chatbox.addEventListener('submit', handle_message);
}

window.onload = main;