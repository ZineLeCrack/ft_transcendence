import { userData } from "../game/game.js";

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("chat-input") as HTMLInputElement;
    const sendBtn = document.getElementById("chat-send") as HTMLButtonElement;
    const messageBox = document.getElementById("chat-messages") as HTMLDivElement;
  
    function sendMessage(username: string, content: string) {
        if (content === "") return;

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

        messageBox.scrollTop = messageBox.scrollHeight;
    }

    const ws = new WebSocket('wss://10.12.200.81:3452');

    ws.onopen = () => {
        console.log("WebSocket connecté !");
    };

    ws.onerror = (err) => {
        console.error("WebSocket erreur:", err);
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            sendMessage(data.username, data.content);
        } catch (err) {
            console.error("Erreur lors du parsing WebSocket message :", err);
        }
    }

    async function displayAllMessages() {
        try {
            const response = await fetch('https://10.12.200.81:3452/getmessages', {
                method: 'POST',
            });
            const data = await response.json();
            const tab = data.tab;
            messageBox.innerHTML = "";
            for (let i = 0; i < tab.length; i++)
                sendMessage(tab[i].username, tab[i].content);
        } catch (err) {
            console.error("Erreur lors de la récupération des messages :", err);
        }
    }

    sendBtn.addEventListener("click", () => {
        const username = userData.userName!;
        const content = input.value.trim();
        if (content === "") return;

        const chatdata = { username, content };
        ws.send(JSON.stringify(chatdata));
        input.value = "";
    });


    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const username = userData.userName!;
            const content = input.value.trim();
            if (content === "") return;

            const chatdata = { username, content };
            ws.send(JSON.stringify(chatdata));
            input.value = "";
        }
    });

    displayAllMessages();
});
