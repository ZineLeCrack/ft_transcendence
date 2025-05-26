"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const form = document.getElementById("a2f");
const sendBtn = document.getElementById('to-send-a2f');
const codeInput = document.getElementById("code-input");
sendBtn.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const Data = {
        IdUser: localStorage.getItem('userId'),
    };
    const response = yield fetch(`https://10.12.200.35:3451/a2f/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Data),
    });
    if (!response.ok) {
        const error = yield response.text();
        throw new Error(error || 'Erreur lors de la connection');
    }
    alert("Mail envoye");
}));
form.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const Data = {
        code: codeInput.value,
        IdUser: localStorage.getItem('userId'),
    };
    const response = yield fetch(`https://10.12.200.35:3451/a2f/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Data),
    });
    if (!response.ok) {
        const error = yield response.text();
        alert("Mauvais code a2f");
        throw new Error(error || 'Erreur lors de la connection');
    }
    console.log("Code 2FA saisi :", Data.code);
    window.location.href = "../../index.html";
}));
