var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { userData } from "../game/game.js";
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("chat-input");
    const sendBtn = document.getElementById("chat-send");
    const messageBox = document.getElementById("chat-messages");
    function sendMessage(username, content) {
        if (content === "")
            return;
        const messageWrapper = document.createElement("div");
        messageWrapper.className = "flex flex-col items-end space-y-1"; // align right
        const usernameDiv = document.createElement("div");
        usernameDiv.className = "text-sm font-semibold text-gray-500 text-right";
        usernameDiv.textContent = username;
        const msg = document.createElement("div");
        msg.className = "bg-purple-500 text-md text-white px-4 py-2 rounded-3xl w-fit max-w-[80%] break-words whitespace-pre-wrap shadow-md shadow-black/50";
        msg.textContent = content;
        messageWrapper.appendChild(usernameDiv);
        messageWrapper.appendChild(msg);
        messageBox.appendChild(messageWrapper);
        // input.value = "";
        messageBox.scrollTop = messageBox.scrollHeight;
    }
    function displayAllMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('https://10.12.200.81:3452/getmessages', {
                    method: 'POST',
                });
                const data = yield response.json();
                const tab = data.tab;
                messageBox.innerHTML = "";
                for (let i = 0; i < tab.length; i++)
                    sendMessage(tab[i].username, tab[i].content);
            }
            catch (err) {
                console.error("Erreur lors de la récupération des messages :", err);
            }
            setTimeout(displayAllMessages, 1000);
        });
    }
    sendBtn.addEventListener("click", () => {
        const username = userData.userName;
        const content = input.value;
        sendMessage(username, content);
    });
    input.addEventListener("keydown", (e) => __awaiter(void 0, void 0, void 0, function* () {
        if (e.key === "Enter") {
            const username = userData.userName;
            const content = input.value;
            const chatdata = {
                username: username,
                content: content
            };
            try {
                const response = yield fetch('https://10.12.200.81:3452/sendinfo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(chatdata),
                });
                if (!response.ok)
                    throw new Error('Erreur serveur');
                input.value = "";
                const data = yield response.json();
                sendMessage(data.username, data.content);
            }
            catch (err) {
                alert('Erreur : ' + err.message);
            }
        }
    }));
    displayAllMessages();
});
