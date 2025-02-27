const sendChatBtn = document.querySelector("#send-btn"); // Send button
const chatInput = document.querySelector(".chat-input textarea"); // Text input
const chatbox = document.querySelector(".chatbox");

const API_KEY = "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"; // 🚨 Move this to a backend in production

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" 
        ? `<p>${message}</p>` 
        : `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    
    chatLi.innerHTML = chatContent;
    return chatLi;
};

const generateResponse = (incomingChatLi, userMessage) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [{ role: "user", content: userMessage }]
        })
    };

    fetch(API_URL, requestOptions)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP Error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            if (data.choices && data.choices.length > 0) {
                messageElement.textContent = data.choices[0].message.content;
                console.log();
            } else {
                throw new Error("Invalid response format from API");
            }
        })
        .catch(error => {
            console.error("API Error:", error);
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
        });
};

const handleChat = () => {
    const userMessage = chatInput.value.trim(); // Get the text input value
    if (!userMessage) return; // Stop if empty

    // Append user's message to chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        generateResponse(incomingChatLi, userMessage);
    }, 600);

    // Clear input field after sending message
    chatInput.value = "";

    // Scroll to bottom after message
    chatbox.scrollTop = chatbox.scrollHeight;
};

// Event listener for send button click
sendChatBtn.addEventListener("click", handleChat);
