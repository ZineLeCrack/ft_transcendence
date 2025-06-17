
export default function initSuccess(content?: string)
{
	const successPopUpHTML = `<div id="success-popup" class="fixed left-1/2 -translate-x-1/2 w-full max-w-md p-4 z-50 font-mono">
    <div class="bg-black/70 backdrop-blur-lg border-2 border-[#FFD700] rounded-xl shadow-[0_0_15px_#FFD700]">
        <div class="flex items-center justify-between px-6 py-3 border-b border-[#FFD700]/50">
            <h3 class="text-xl font-bold text-[#00FFFF]" >✅</h3>
            <button id="close-success-popup" class="text-[#FFD700] hover:text-white text-3xl font-bold leading-none hover:opacity-75 transition-opacity duration-200">&times;</button>
        </div>
        <div class="p-6">
            <p id="success-popup-message" class="text-white text-center text-base">
                User successfully created.
            </p>
        </div>
    </div>
</div>`;

	const oldPopup = document.getElementById('success-popup');
    if (oldPopup)
		oldPopup.remove();

    document.body.insertAdjacentHTML('beforeend', successPopUpHTML);

	const messageElement = document.getElementById('success-popup-message');
	if (messageElement && content)
	{
		messageElement.textContent = content;
	}
	else if (messageElement) 
	{
		messageElement.textContent = 'An unexpected success occurred.';
	}

    const popup = document.getElementById('success-popup');
    const closeBtn = document.getElementById('close-success-popup');

    const closePopup = () => {
        popup?.remove();
    };

    closeBtn?.addEventListener('click', closePopup);

    setTimeout(closePopup, 5000);
}