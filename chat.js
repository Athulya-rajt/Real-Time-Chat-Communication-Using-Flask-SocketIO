const socket = io.connect("http://127.0.0.1:5000");

// Connection status
socket.on("connect", () => {
    console.log("Connected to server");
    showNotification("Connected to chat server", "success");
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
    showNotification("Disconnected from server", "error");
});

// Send message function
function sendMessage() {
    const messageInput = document.getElementById("message");
    const message = messageInput.value.trim();

    if (message !== "") {
        console.log("Sending message:", message);
        socket.emit("message", message);

        // Add message to chat
        const messagesDiv = document.getElementById("messages");
        const messageElement = document.createElement("div");
        messageElement.className = "message sent";
        messageElement.innerHTML = `
            <span class="sender">You:</span>
            <span class="text">${message}</span>
            <span class="time">${getCurrentTime()}</span>
        `;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // Show sent notification
        showNotification("Message sent!", "success");

        messageInput.value = "";
    }
}

// Receive message
socket.on("message", function(msg) {
    if (!msg.startsWith("You: ")) {  // Don't show own messages twice
        const messagesDiv = document.getElementById("messages");
        const messageElement = document.createElement("div");
        messageElement.className = "message received";
        messageElement.innerHTML = `
            <span class="sender">Other:</span>
            <span class="text">${msg}</span>
            <span class="time">${getCurrentTime()}</span>
        `;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
});

// Helper functions
function showNotification(message, type) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}

function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Event listeners
document.getElementById("message").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

// Typing indicator
let typingTimeout;
document.getElementById("message").addEventListener("input", function() {
    clearTimeout(typingTimeout);
    socket.emit("typing", true);
    
    typingTimeout = setTimeout(() => {
        socket.emit("typing", false);
    }, 1000);
});

socket.on("typing", function(data) {
    const typingIndicator = document.getElementById("typing-indicator");
    typingIndicator.style.display = data ? "block" : "none";
});
