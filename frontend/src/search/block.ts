
export default async function initBlockPlayer(target?: string) {
	if (target) {
		const blockbtn = document.getElementById("block-btn") as HTMLButtonElement;
    	const tokenID = sessionStorage.getItem("token");

		if (!blockbtn || !target || !tokenID) return;
		const checkBlockStatus = async () => {
			const res = await fetch("/api/isblock", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ tokenID, target })
			});
			const data = await res.json();
			// status 1 = bloqué, 0 = pas bloqué
			if (data.status === 1) {
				blockbtn.textContent = "Unblock Player"; //faire en sorte qu'on puisse plus ajouter en ami !!!!!!!!!!!!!!!
			} else {
				blockbtn.textContent = "Block Player";
			}
		};

		await checkBlockStatus();

		blockbtn.addEventListener("click", async () => {
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
			window.location.reload();
		});
	}
}