export default async function initAddFriend() {
    const friendbtn = document.getElementById("friend-btn") as HTMLButtonElement;
    const target = document.getElementById("username-h2")?.textContent;
    const username = sessionStorage.getItem("userName");

    if (!friendbtn || !target|| !username) return;

    const checkFriendStatus = async () => {
        const res = await fetch("/api/isfriend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, target })
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
        if (friendbtn.textContent === "Add Friend") {
			console.log("add button clicked");
            const res = await fetch("/api/requestfriend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, target })
            });
            const data = await res.json();
            if (data.success) {
                friendbtn.textContent = "Request Sent";
            }
        } else if (friendbtn.textContent === "Remove Friend") {
			console.log("remove button clicked");
            const res = await fetch("/api/removefriend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, target })
            });
            const data = await res.json();
            if (data.success) {
                friendbtn.textContent = "Add Friend";
            }
        } else if (friendbtn.textContent === "Request Received") {
            console.log("request received button clicked");
            const res = await fetch("/api/replyrequest", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, target , answer: 1})
            });
            const data = await res.json();
            if (data.success) {
                friendbtn.textContent = "Remove Friend";
            }
        }
    });
}