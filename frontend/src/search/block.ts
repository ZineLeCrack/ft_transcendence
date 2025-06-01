
export default async function initBlockPlayer() {
	const blockbtn = document.getElementById("block-btn") as HTMLButtonElement;
	
	blockbtn.addEventListener("click",  () => {
		console.log("Block button clicked");
		if (blockbtn.textContent === "Block Player")
		{
			blockbtn.textContent = "Unblock Player";
		}
		else
		{
			blockbtn.textContent = "Block Player";
		}
	}); // ajouter fetch pour bloquer le joueur
}