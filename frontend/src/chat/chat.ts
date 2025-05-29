import { userData } from "../game/choosegame.js";

export default function initChat() {

const IP_NAME = import.meta.env.VITE_IP_NAME;

    const input = document.getElementById("chat-input") as HTMLInputElement;
    const sendBtn = document.getElementById("chat-send") as HTMLButtonElement;
    const messageBox = document.getElementById("chat-messages") as HTMLDivElement;
  
    function sendMessage(username: string, content: string) {
        if (content === "") return;

        const messageWrapper = document.createElement("div");
        const usernameDiv = document.createElement("a");
        const msg = document.createElement("div");

        if (userData.userName === username) {
            messageWrapper.className = "flex flex-col items-end space-y-1";
            usernameDiv.className = "text-[#0f9292] font-mono text-sm hover:underline cursor-pointer"; 
            msg.className = "font-mono text-[#00FFFF] px-4 py-2 w-fit max-w-[80%] break-words border border-[#0f9292] bg-black/40 rounded-md shadow-[0_0_5px_#0f9292]";
            msg.textContent = `${content}`;
        } else {
            messageWrapper.className = "flex flex-col items-start space-y-1";
            usernameDiv.className = "text-[#FF007A] font-mono text-sm hover:underline cursor-pointer";
            msg.className = "font-mono text-[#00FFFF] px-4 py-2 w-fit max-w-[80%] break-words border border-[#FF007A] bg-black/40 rounded-md shadow-[0_0_5px_#FF007A]";
            msg.textContent = `${content}`;
        }
        
        usernameDiv.textContent = username;
        usernameDiv.href = `/users/${username}`;

        messageWrapper.appendChild(usernameDiv);
        messageWrapper.appendChild(msg);
        messageBox.appendChild(messageWrapper);

        messageBox.scrollTop = messageBox.scrollHeight;
    }

    const ws = new WebSocket(`wss://${IP_NAME}:3451`);

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
            const response = await fetch(`https://${IP_NAME}:3451/getmessages`, {
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
}

