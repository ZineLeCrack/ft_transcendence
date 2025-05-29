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

        if (userData.userName === username)
        {
            messageWrapper.className = "flex flex-col items-end space-y-1";
            usernameDiv.className = "text-sm font-semibold text-white text-right hover:underline cursor-pointer"; 
            msg.className = "border-2 border-[#00FFFF] bg-white/5 backdrop-blur-lg text-md text-white px-4 py-2 rounded-3xl w-fit max-w-[80%] break-words whitespace-pre-wrap shadow-[0_0_10px_#00FFFF]";
        }
        else
        {
            messageWrapper.className = "flex flex-col items-start space-y-1";
            usernameDiv.className = "text-sm font-semibold text-white text-left hover:underline cursor-pointer";
            msg.className = "border-2 border-[#FF007A] bg-white/5 backdrop-blur-lg text-md text-white px-4 py-2 rounded-3xl w-fit max-w-[80%] break-words whitespace-pre-wrap shadow-[0_0_10px_#FF007A]";

        }
        
        usernameDiv.textContent = username;
        usernameDiv.href = `/users/${username}`;
        msg.textContent = content;

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

