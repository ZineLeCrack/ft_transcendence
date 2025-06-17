

export default function initError(content?: string)
{
	const errorPopUpHTML = `<div id="error-popup" class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4 z-50 font-mono">
	<div class="bg-black/70 backdrop-blur-lg border-2 border-[#FF2E9F] rounded-xl shadow-[0_0_15px_#FF2E9F]">
		<div class="flex items-center justify-between px-6 py-3 border-b border-[#FF2E9F]/50">
			<h3 class="text-xl font-bold text-[#FF2E9F]" >❌</h3>
			<button id="close-error-popup" class="text-[#FF2E9F] hover:text-white text-3xl font-bold leading-none hover:opacity-75 transition-opacity duration-200">&times;</button>
		</div>
		<div class="p-6">
			<p id="error-popup-message" class="text-white text-center text-base">
				Sorry, you encountered an error.
			</p>
		</div>
	</div>
</div>`;
	
	const oldPopup = document.getElementById('error-popup');
	if (oldPopup)
		oldPopup.remove();

	document.body.insertAdjacentHTML('beforeend', errorPopUpHTML);

	const messageElement = document.getElementById('error-popup-message');
	if (messageElement && content)
	{
		messageElement.textContent = content;
	}
	else if (messageElement) 
	{
		messageElement.textContent = 'Sorry, you encountered an error.';
	}

	const popup = document.getElementById('error-popup');
	const closeBtn = document.getElementById('close-error-popup');

	const closePopup = () => {
		popup?.remove();
	};

	closeBtn?.addEventListener('click', closePopup);

	setTimeout(closePopup, 2000);
}