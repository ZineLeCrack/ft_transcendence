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
                friendbtn.textContent = "Remove Friend";
            } else if (data.status === 2) {
                friendbtn.textContent = "Request Sent";
            } else if (data.status === 3) {
                friendbtn.textContent = "Request Received";
            } else {
                friendbtn.textContent = "Add Friend";
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
                    friendbtn.textContent = "Request Sent";
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
                    friendbtn.textContent = "Add Friend";
                }
            }
            window.location.reload();
        });
    }
}