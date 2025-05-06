const editbtn = document.getElementById('edit-btn') as HTMLButtonElement;
const statsbtn = document.getElementById('stats-btn') as HTMLButtonElement;
const statsdiv = document.getElementById('stats-div') as HTMLDivElement;
const editdiv = document.getElementById('edit-div') as HTMLDivElement;

editbtn.addEventListener('click', () => {

    statsbtn.classList.add('bg-gray-200');
    statsbtn.classList.remove('bg-blue-500');
    editbtn.classList.remove('bg-gray-200');
    editbtn.classList.add('bg-blue-500');
    editbtn.classList.add('text-white');
    editbtn.classList.remove('text-gray-800');
    statsbtn.classList.remove('text-white');
    statsbtn.classList.add('text-gray-800');
    statsdiv.classList.add('hidden');
    editdiv.classList.remove('hidden');
});

statsbtn.addEventListener('click', () => {

    statsbtn.classList.remove('bg-gray-200');
    statsbtn.classList.add('bg-blue-500');
    editbtn.classList.add('bg-gray-200');
    editbtn.classList.remove('bg-blue-500');
    statsbtn.classList.add('text-white');
    statsbtn.classList.remove('text-gray-800');
    editbtn.classList.remove('text-white');
    editbtn.classList.add('text-gray-800');
    statsdiv.classList.remove('hidden');
    editdiv.classList.add('hidden');
    
});


const editpassewordbtn = document.getElementById('edit-password-btn') as HTMLButtonElement;
const editusernamediv = document.getElementById('edit-username-div') as HTMLDivElement;
const editemaildiv = document.getElementById('edit-email-div') as HTMLDivElement;
const editcurrentpassworddiv = document.getElementById('edit-current-password-div') as HTMLDivElement;
const editnewpassworddiv = document.getElementById('edit-new-password-div') as HTMLDivElement;
const editconfirmpassworddiv = document.getElementById('edit-confirm-new-password-div') as HTMLDivElement;

editpassewordbtn.addEventListener('click', () => {

    editusernamediv.classList.add('hidden');
    editemaildiv.classList.add('hidden');
    editcurrentpassworddiv.classList.remove('hidden');
    editnewpassworddiv.classList.remove('hidden');
    editconfirmpassworddiv.classList.remove('hidden');

});
