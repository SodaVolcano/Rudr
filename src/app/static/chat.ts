document.addEventListener("DOMContentLoaded", main);

interface BotResponse {
  status: string;
  messages: string[];
  conversation_id: string;
}

interface BotInitResponse {
  status: string;
  bot_id: string;
}

interface ConversationInitResponse {
  status: string;
  conversation_id: string;
  error: string;
}

interface receiveConversationResponse {
  status: string;
  conversation_id: string;
  conversation: message[];
  error: string;
}
interface displayConversationListResponse {
  status: string;
  conversations: string[];
  error: string;
}

interface message {
  id: BigInteger;
  content: string;
  conversationID: string;
  speaker: string;
  emotion: string;
}


// ======================== global variables ========================

// When timer expires, send queued messages to server. reset on each input
let typingTimer: number;
const MAX_TYPING_DELAY = 5000; // miliseconds
let typingDelay = MAX_TYPING_DELAY; // miliseconds, gradually decreases
const messageQueue: string[] = [];

// Timer for window resize, delay to allow bootstrap to adjust
let resizeTimeout: number | undefined;
let maxChatboxHeight: number = 227.5; // Found by trial and error
let minChatboxHeight: number; // Computed from CSS on load in main()

// current conversation id
let currentConversationID = "";

// Controls whether the scrollbar should be scrolled to the bottom
// If user scrolled up, don't scroll down when new messages arrive
let scrolledUp = false;

// Image sources
/* https://dribbble.com/shots/14503125-Robot-Avatar-Icons */
const imageSources: string[] = [
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
  if (underChatbox != null) underChatbox.style.height = minChatboxHeight + "px";


  $("#chatbox-submit")[0].addEventListener("click", QueueMessage);
  $("#chatbox-content")[0].addEventListener("keydown", function (event) {
    if (event.key === "Enter") QueueMessage(event);
  });

  $("#new-chat")[0].addEventListener("click", newChat);
  $.get("/get_conversations").done(displayConversations);

  const conversationList = document.getElementById("conversations");
  if (conversationList == null) {
    newChat();
  }

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
    const scrollbar = <HTMLDivElement>event.target;
    scrolledUp = !(
      scrollbar.scrollTop + scrollbar.clientHeight >=
      scrollbar.scrollHeight - 1
    );
  });

  // No Conversation
}

// ================== conversation init and switiching ====================

function checkConversationInit(response: ConversationInitResponse) {
  if (response.status !== "OK")
    throw new Error("Failed to initialise conversation");
  currentConversationID = response.conversation_id;

  console.log(
    `SUCCESS: Conversation initialised with id ${response.conversation_id}`
  );

  addConversation(response.conversation_id);
  // append to list

}

/**
 * Get a list of conversations from the user, and display it in the unorderd list on the chat.html page
 */
async function displayConversations(response: displayConversationListResponse) {
  const conversationList = document.getElementById("conversations");

  if (response.status == "EMPTY"|| conversationList == null) {
    return;
  }
  conversationList.replaceChildren();
  const all_conversations = response.conversations;
  // Loop through each conversation
  for (let i = 0; i < all_conversations.length; i++) {
    addConversation(all_conversations[i])
  }
}

function addConversation(id: string) {
  const conversationList = document.getElementById("conversations");
  if (conversationList == null) {
    return;
  }
  console.log(id);
  // get conversation and add it to the ul list on /chat
  const div = document.createElement("div");
  const img = document.createElement("img");
  img.src = imageSources[parseInt(id) % imageSources.length];
  img.alt = id;
  const hue = ((parseInt(id)) * 360) / 10000; //Adjust hue by id
  img.style.filter = `hue-rotate(${hue}deg)`;
  div.appendChild(img);
  const name = document.createElement("h5");
  name.textContent = id.padStart(4, '0'); // Change with Robot Name
  div.appendChild(name);
  div.classList.add("conversation-container");
  div.setAttribute("id", id);
  div.addEventListener("click", () => {
    changeConversation(id);
  });
  conversationList.appendChild(div);
}

function receiveConversation(response: receiveConversationResponse) {
  if (response.status !== "OK")
    throw new Error("Failed to initialise conversation");
  // replace current conversation messages with the given ones
  console.log(
    `SUCCESS: New Conversation initialised with id ${response.conversation_id}`
  );
  currentConversationID = response.conversation_id;
  console.log(response.conversation_id)
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

function changeConversation(conversation_id: string) {
  sendQueuedMessages();
  resetTimer();

  // Change seleceted icon
  const prevSelected = document.getElementsByClassName("selected");
  for (let i = 0; i < prevSelected.length; i++) {
    prevSelected[i].classList.remove("selected");
  }
  const newSelected = document.getElementById(conversation_id);
  newSelected?.classList.add("selected");

  // Change title
  const title = document.getElementById("name-title");
  if (title != null) title.textContent = conversation_id.padStart(4, "0");

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
  clearConversation();

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
  if (resizeTimeout) clearTimeout(resizeTimeout);

  resizeTimeout = setTimeout(adjustHeight, 20);
}

/**
 * Adjust height of the chatbox
 */
function adjustHeight(event: Event) {
  const underChatbox = document.getElementById("under-chatbox");
  const chatboxArea = $(".chatbox-area")[0];
  const textarea: HTMLTextAreaElement = <HTMLTextAreaElement>(
    $("#chatbox-content")[0]
  );
  // Reset height - always adjust height from min height
  // This allows box to shrink when user deletes messages
  chatboxArea.style.height = minChatboxHeight + "px";

  const computedStyle = window.getComputedStyle(chatboxArea);
  const height = parseFloat(computedStyle.height);

  // If at min height, textarea overflows, expand chatbox
  if (textarea.scrollHeight > textarea.clientHeight) {
    const newHeight = Math.min(
      height + textarea.scrollHeight - textarea.clientHeight,
      maxChatboxHeight
    );
    chatboxArea.style.height = newHeight + "px";
    if (underChatbox != null) underChatbox.style.height = newHeight + "px";
  }
}

// ================ submit/recieve message from server ===================

/**
 * Handle the bot response from the server
 * @param response JSON object containing the response from the server
 */
function delay(duration: number): Promise<void> {
  return new Promise<void>(function (resolve) {
    setTimeout(resolve, duration);
  });
}

async function recieveBotReply(response: BotResponse): Promise<void> {
  if (response.status !== "OK") throw new Error("Failed to recieve bot reply");
  console.log("current: " + currentConversationID)
  console.log("response: " + response.conversation_id)

  if (response.conversation_id != currentConversationID)
    throw new Error("Messages are from another conversation");
  console.log("recieved bot reply");
  for (let message of response.messages) {
    await displayMessage(message, false);
  }
}

function checkBotInit(response: BotInitResponse) {
  if (response.status !== "OK") throw new Error("Failed to initialise bot");
  console.log(`SUCCESS: Bot initialised with id ${response.bot_id}`);
}

/**
 * Package user messages as JSON and send to Flask route
 * @param event
 */
function sendQueuedMessages() {
  if (messageQueue.length === 0) return;

  // Send AJAX POST request to Flask route
  $.ajax({
    url: "/process-msg",
    method: "POST",
    data: {
      messages: JSON.stringify(messageQueue),
      conversation_id: JSON.stringify(currentConversationID),
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
function QueueMessage(event: Event) {
  let message = $("#chatbox-content").val();

  if (typeof message !== "string") throw new Error("Message is not a string");

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
async function displayMessage(message: string, isFromUser: boolean) {
  return new Promise<void>(async (resolve) => {
    const cssClass = isFromUser ? "msg-user-wrapper" : "msg-bot-wrapper";
    if (isFromUser) {
      $(".chat-history").append(
        `<div class="${cssClass}"><div class="speech-bubble"><p>${message}</p></div></div>`
      );
    } else {
      $(".chat-history").append(
        `<div class="${cssClass}"><div class="speech-bubble"><p id="new-message"></p></div></div>`
      );
    }
    if (!scrolledUp) {
      $(".scrollbar")[0].scrollTop = $(".scrollbar")[0].scrollHeight;
    }

    if (!isFromUser) {
      const newMessage = document.getElementById("new-message");
      if (newMessage != null) {
        console.log("sdajdhajsdk");
        console.log(message);
        await typewriterWrite(newMessage, message);
        newMessage.removeAttribute("id");
      }
    }
    resolve();
  });
}

/**
 * Append a message to the chat HTML element, but without the typewriter effect for switching between conversations
 * @param message string of the message to display
 * @param sender  whether the message was sent by the user or the bot
 */
function reDisplayMessage(message: string, isFromUser: boolean) {
  const cssClass = isFromUser ? "msg-user-wrapper" : "msg-bot-wrapper";
  $(".chat-history").append(
    `<div id="msg" class="${cssClass}"><div class="speech-bubble"><p>${message}</p></div></div>`
  );
  if (!scrolledUp) {
    $(".scrollbar")[0].scrollTop = $(".scrollbar")[0].scrollHeight;
  }
}
