
export default async function initAddFriend() {
	
	const friendbtn = document.getElementById("friend-btn") as HTMLButtonElement;
	
	
	friendbtn.addEventListener("click", () => {
		console.log("Friend button clicked");
		if (friendbtn.textContent === "Add Friend")
		{
			friendbtn.textContent = "Remove Friend";
		}
		else
		{
			friendbtn.textContent = "Add Friend";
		}
	}); // ajouter fetch pour ajouter l'ami
}