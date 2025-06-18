import { translate } from "../i18n";
import { getWebSocket } from "../websocket";

export default async function initBlockPlayer(target?: string) {
	if (target) {
		const blockbtn = document.getElementById("block-btn") as HTMLButtonElement;
		const tokenID = sessionStorage.getItem("token");

		if (!blockbtn || !target || !tokenID) return ;
		const checkBlockStatus = async () => {
			try {
				const res = await fetch("/api/isblock", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ tokenID, target })
				});
				const data = await res.json();
				if (data.status === 1) {
					blockbtn.textContent = translate("Unblock_Player");
				} else {
					blockbtn.textContent = translate("block_friend_trad");
				}
			} catch (err) {
				console.error('Error getting user status:', err);
			}
		};

		await checkBlockStatus();

		blockbtn.onclick = null;

		blockbtn.onclick = async () => {
			let res;
			try {
				res = await fetch("/api/isblock", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ tokenID, target })
				});
			} catch (err) {
				console.error('Error getting user status:', err);
				return ;
			}
			const block = await res.json();
			const ws = getWebSocket();

			if (block.status === 0)
			{
				try {
					const res = await fetch("/api/blockplayer", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ tokenID, target })
					})
					const data = await res.json();
					if (data.success)
						blockbtn.textContent = translate("Unblock_Player");
					let chatdata;
					chatdata = { type: 'block_users', token: tokenID, targetUsername : target};
					ws?.send(JSON.stringify(chatdata));
				} catch (err) {
					console.error('Error blocking user:', err);
					return ;
				}
			}
			else if (block.status === 1)
			{
				try {
					const res = await fetch("/api/unblockplayer", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ tokenID, target })
					});
					const data = await res.json();
					if (data.success)
						blockbtn.textContent = translate("block_friend_trad");
					let chatdata;
					chatdata = { type: 'unblock_users', token: tokenID, targetUsername : target};
					ws?.send(JSON.stringify(chatdata));
				} catch (err) {
					console.error('Error unblocking user:', err);
				}
			}
		};
	}
}
