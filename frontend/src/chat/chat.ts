import { userData } from "../game/choosegame.js";


export function sendMessage(username: string, content: string, messageBox: HTMLDivElement, pong?: boolean, targetUser: string = "global") {

    const messageWrapper = targetUser === "global" ?  document.getElementById('chat-messages-global')
    : document.querySelector(`#chat-messages-${targetUser}`);

    if (!messageWrapper)
        return;
    
    if (pong === true) {
        messageWrapper.className = "flex flex-col items-center space-y-2 my-4";
        
        const msg = document.createElement("div");
        msg.className = "font-mono text-[#00FFFF] px-6 py-3 text-center w-fit max-w-[80%] break-words border-2 border-[#FF007A] bg-black/40 rounded-xl shadow-[0_0_10px_#FF007A]";
        msg.textContent = `${username} wants to play with you !`;
        
        const buttonsDiv = document.createElement("div");
        buttonsDiv.className = "flex gap-4 mt-2";
        
        const acceptBtn = document.createElement("button");
        acceptBtn.className = "bg-transparent border-2 border-[#00FFFF] px-6 py-2 rounded-xl text-[#00FFFF] font-bold hover:bg-[#00FFFF]/20 transition duration-200 shadow-[0_0_10px_#00FFFF]";
        acceptBtn.textContent = "Accept";
        
        const declineBtn = document.createElement("button");
        declineBtn.className = "bg-transparent border-2 border-[#FF007A] px-6 py-2 rounded-xl text-[#FF007A] font-bold hover:bg-[#FF007A]/20 transition duration-200 shadow-[0_0_10px_#FF007A]";
        declineBtn.textContent = "Decline";
        
        acceptBtn.addEventListener('click', () => {
            // TODO: Handle game acceptance
            console.log('Game accepted');
            messageWrapper.remove();
        });
        
        declineBtn.addEventListener('click', () => {
            // TODO: Handle game decline
            console.log('Game declined');
            messageWrapper.remove();
        });
        
        buttonsDiv.appendChild(acceptBtn);
        buttonsDiv.appendChild(declineBtn);
        messageWrapper.appendChild(msg);
        messageWrapper.appendChild(buttonsDiv);
        messageBox.appendChild(messageWrapper);
        return;
    }

    if (content === "") return;

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
export default function initChat() {

    const input = document.getElementById("chat-input") as HTMLInputElement;
    const sendBtn = document.getElementById("chat-send") as HTMLButtonElement;
    const messageBox = document.getElementById("chat-messages") as HTMLDivElement;
  

    const ws = new WebSocket(`wss://${window.location.host}/ws/`);

    ws.onopen = () => {
        console.log("WebSocket connecté !");
    };

    ws.onerror = (err) => {
        console.error("WebSocket erreur:", err);
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            sendMessage(data.username, data.content, messageBox);
        } catch (err) {
            console.error("Erreur lors du parsing WebSocket message :", err);
        }
    }

    async function displayAllMessages() {
        try {
            const response = await fetch(`/api/getmessages`, {
                method: 'POST',
            });
            const data = await response.json();
            const tab = data.tab;
            messageBox.innerHTML = "";
            for (let i = 0; i < tab.length; i++)
                sendMessage(tab[i].username, tab[i].content, messageBox);
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

