"use strict";
// Récupère le formulaire
const form = document.getElementById("a2f");
// Récupère l'input
const codeInput = document.getElementById("code-input");
// Écoute la soumission du formulaire
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = codeInput.value.trim();
    console.log("Code 2FA saisi :", code);
    window.location.href = "../../index.html";
});
