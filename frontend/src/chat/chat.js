"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("chat-input");
    const sendBtn = document.getElementById("chat-send");
    const messageBox = document.getElementById("chat-messages");
    function sendMessage() {
        const text = input.value;
        if (text === "")
            return;
        const messageWrapper = document.createElement("div");
        messageWrapper.className = "flex flex-col items-start space-y-1";
        const username = document.createElement("div");
        username.className = "text-sm font-semibold text-gray-500 ";
        username.textContent = "rlebaill";
        const msg = document.createElement("div");
        msg.className = "bg-purple-500 text-md text-white px-4 py-2 rounded-3xl w-fit max-w-[80%] break-words whitespace-pre-wrap shadow-md shadow-black/50";
        msg.textContent = text;
        messageWrapper.appendChild(username);
        messageWrapper.appendChild(msg);
        messageBox.appendChild(messageWrapper);
        input.value = "";
        messageBox.scrollTop = messageBox.scrollHeight;
    }
    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter")
            sendMessage();
    });
});
