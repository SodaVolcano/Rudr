function sucessful(response) {
    console.log(typeof(response));
    if (response.status === 'success') {
        // Update chat interface with new message
        $('#chatbox').append(`<p>${response.message}</p>`);
        $('#msg-chatbox').val('');  // Clear message box
    }
    else {
        // idk man
    }
}

function handle_error() {

}

function handle_message(event: Event) {
    event.preventDefault();  // Prevent default form submission from browser
    let message = $('#msg-chatbox').val();

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

$(document).ready(function() {
    $('#msg-chatbox').on('submit', handle_message);
})