const editbtn = document.getElementById('edit-btn') as HTMLButtonElement;
const statsbtn = document.getElementById('stats-btn') as HTMLButtonElement;
const statsform = document.getElementById('stats-form') as HTMLFormElement;
const editprofilform = document.getElementById('edit-profil-form') as HTMLFormElement;

let editbtnisactive = false;
let statsbtnisactive = true;


    editbtn.addEventListener('click', () => {

        if (editbtnisactive)
            return;
        editbtnisactive = true;
        statsbtnisactive = false;
        statsbtn.classList.add('bg-gray-200');
        statsbtn.classList.remove('bg-blue-500');
        editbtn.classList.remove('bg-gray-200');
        editbtn.classList.add('bg-blue-500');
        editbtn.classList.add('text-white');
        editbtn.classList.remove('text-gray-800');
        statsbtn.classList.remove('text-white');
        statsbtn.classList.add('text-gray-800');
        statsform.classList.add('hidden');
        editprofilform.classList.remove('hidden');
        editpasswordform.classList.add('hidden');
        editpasswordbtn.classList.remove('hidden');

        });

    statsbtn.addEventListener('click', () => {

        if (statsbtnisactive)
            return;
        editbtnisactive = false;
        statsbtnisactive = true;
        statsbtn.classList.remove('bg-gray-200');
        statsbtn.classList.add('bg-blue-500');
        editbtn.classList.add('bg-gray-200');
        editbtn.classList.remove('bg-blue-500');
        statsbtn.classList.add('text-white');
        statsbtn.classList.remove('text-gray-800');
        editbtn.classList.remove('text-white');
        editbtn.classList.add('text-gray-800');
        statsform.classList.remove('hidden');
        editprofilform.classList.add('hidden');
        editpasswordform.classList.add('hidden');
        editpasswordbtn.classList.remove('hidden');
        editusernameinput.value = "";
        editemailinput.value = "";
        editcurrentpasswordinput.value = "";
        editnewpasswordinput.value = "";
        editconfirmnewpasswordinput.value = "";
    
    });


const editpasswordbtn = document.getElementById('edit-password-btn') as HTMLButtonElement;
const editpasswordform = document.getElementById('edit-password-form') as HTMLFormElement;

editpasswordbtn.addEventListener('click', () => {

    editprofilform.classList.add('hidden');
    editpasswordform.classList.remove('hidden');
    editpasswordbtn.classList.add('hidden');

});

const unsavebtn = document.getElementById('unsave-btn') as HTMLButtonElement;
const savebtn = document.getElementById('save-btn') as HTMLButtonElement;
const editusernameinput = document.getElementById('edit-username-input') as HTMLInputElement;
const editemailinput = document.getElementById('edit-email-input') as HTMLInputElement;
const editcurrentpasswordinput = document.getElementById('edit-currentpassword-input') as HTMLInputElement;
const editnewpasswordinput = document.getElementById('edit-newpassword-input') as HTMLInputElement;
const editconfirmnewpasswordinput = document.getElementById('edit-confirmpassword-input') as HTMLInputElement;
const unsavebtneditpassword = document.getElementById('unsave-btn-edit-password') as HTMLButtonElement;

unsavebtn.addEventListener('click', () =>{

    editusernameinput.value = "";
    editemailinput.value = "";
});

unsavebtneditpassword.addEventListener('click', () =>{

    editcurrentpasswordinput.value = "";
    editnewpasswordinput.value = "";
    editconfirmnewpasswordinput.value = "";
    editprofilform.classList.remove('hidden');
    editpasswordform.classList.add('hidden');
    editpasswordbtn.classList.remove('hidden');
});