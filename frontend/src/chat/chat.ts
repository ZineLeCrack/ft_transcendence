document.addEventListener("DOMContentLoaded", () => {
	const input = document.getElementById("chat-input") as HTMLInputElement;
	const sendBtn = document.getElementById("chat-send") as HTMLButtonElement;
	const messageBox = document.getElementById("chat-messages") as HTMLDivElement;
  
	function sendMessage() {
		const text = input.value;
		if (text === "") return;

		const messageWrapper = document.createElement("div");
		messageWrapper.className = "flex flex-col items-start space-y-1";

		const username = document.createElement("div");
		username.className = "text-sm font-semibold text-gray-500 ";
		username.textContent = "username";
		
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
	input.addEventListener("keydown", async (e) => {
		if (e.key === "Enter") {
			try {
		const response = await fetch('https://10.12.200.87:3451/submit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(input.value),
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(error || 'Erreur lors de l’inscription');
		}

		// alert('Inscription réussie !');
		window.location.href = "../../index.html";
	} catch (err) {
		alert('Erreur : ' + (err as Error).message);
	}
		};
	});
});
