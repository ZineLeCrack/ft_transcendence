import { translate } from "../i18n";
import { getWebSocket } from "../websocket";

export default async function initAddFriend(target?: string) {
    if (target) {
        const friendbtn = document.getElementById("friend-btn") as HTMLButtonElement;
        const target = document.getElementById("username-h2")?.textContent;
        const tokenID = sessionStorage.getItem("token");

        if (!friendbtn || !target || !tokenID) return;

        const checkFriendStatus = async () => {
            const res = await fetch("/api/isfriend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tokenID, target })
            });
            const data = await res.json();
            // status 1 = amis, 2 = demande envoyée, 3 = demande reçue, 0 = rien
            if (data.status === 1) {
                friendbtn.textContent = translate("Remove_Friend");
            } else if (data.status === 2) {
                friendbtn.textContent = translate("Request_Sent");
            } else if (data.status === 3) {
                friendbtn.textContent = translate("Request_Received");
            } else {
                friendbtn.textContent = translate("add_friend_trad");
            }
        };
        
        await checkFriendStatus();

        friendbtn.addEventListener("click", async () => {
            const res = await fetch("/api/isfriend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tokenID, target })
            });
            const friend = await res.json();
            const ws = getWebSocket();
            if (friend.status === 0)
            {
                const res = await fetch("/api/requestfriend", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tokenID, target })
                });
                const data = await res.json();
                if (data.success) {
                    friendbtn.textContent = translate("Request_Sent");
                }
                let chatdata;
                chatdata = { type: 'add_friend', token: tokenID, targetUsername : target};
                ws?.send(JSON.stringify(chatdata));
            }
            else if (friend.status === 1)
            {
                const res = await fetch("/api/removefriend", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ tokenID, target })
                });
                const data = await res.json();
                if (data.success) {
                    friendbtn.textContent = translate("add_friend_trad");
                }
            }
            window.location.reload();
        });
    }
}