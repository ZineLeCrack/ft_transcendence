
export default async function initBlockPlayer() {
	const blockbtn = document.getElementById("block-btn") as HTMLButtonElement;
    const target = document.getElementById("username-h2")?.textContent;
    const tokenID = sessionStorage.getItem("token");

	if (!blockbtn || !target || !tokenID) return;

	// Vérifie si l'utilisateur visite sa propre page
    try {
        const res = await fetch("/api/verifuser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: tokenID })
        });
        const data = await res.json();
        if (data.original === target) {
            blockbtn.style.display = "none";
            return;
        }
    } catch (e) {
        blockbtn.style.display = "none";
        return;
    }

	const checkBlockStatus = async () => {
		const res = await fetch("/api/isblock", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ tokenID, target })
		});
		const data = await res.json();
		// status 1 = bloqué, 0 = pas bloqué
		if (data.status === 1) {
			blockbtn.textContent = "Unblock Player";
		} else {
			blockbtn.textContent = "Block Player";
		}
	};
	
	await checkBlockStatus();

	blockbtn.addEventListener("click", async () => {
		console.log("Block button clicked");

		if (blockbtn.textContent === "Block Player") {
			const res = await fetch("/api/blockplayer", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ tokenID, target })
			})
			const data = await res.json();
            if (data.success)
				blockbtn.textContent = "Unblock Player";
		} else if (blockbtn.textContent === "Unblock Player") {
			const res = await fetch("/api/unblockplayer", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ tokenID, target })
			});
			const data = await res.json();
			if (data.success) 
				blockbtn.textContent = "Block Player";
		}
	});
}