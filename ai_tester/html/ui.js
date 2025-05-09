"use strict";
// Éléments du DOM
const logArea = document.getElementById("logArea");
const apiEndpointInput = document.getElementById("apiEndpoint");
const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");
const clearLogBtn = document.getElementById("clearLogBtn");
const manualModeBtn = document.getElementById("manualModeBtn");
const apiModeBtn = document.getElementById("apiModeBtn");
const manualControls = document.getElementById("manualControls");
const apiControls = document.getElementById("apiControls");
const moveUpBtn = document.getElementById("moveUpBtn");
const moveDownBtn = document.getElementById("moveDownBtn");
// Fonction pour effacer le journal
function clearLog() {
    logArea.value = "";
}
// Fonction pour basculer entre les modes
function switchToManualMode() {
    manualModeBtn.classList.remove("button-outline");
    apiModeBtn.classList.add("button-outline");
    manualControls.style.display = "block";
    apiControls.style.display = "none";
    // Si connecté à l'API, se déconnecter
    if (window.aiManager.isConnected()) {
        window.aiManager.disconnectFromApi();
    }
}
function switchToApiMode() {
    apiModeBtn.classList.remove("button-outline");
    manualModeBtn.classList.add("button-outline");
    apiControls.style.display = "block";
    manualControls.style.display = "none";
}
// Initialisation de l'interface utilisateur
function initUI() {
    // Boutons de l'interface
    clearLogBtn.addEventListener("click", clearLog);
    manualModeBtn.addEventListener("click", switchToManualMode);
    apiModeBtn.addEventListener("click", switchToApiMode);
    moveUpBtn.addEventListener("click", () => window.aiManager.simulateMovement("up"));
    moveDownBtn.addEventListener("click", () => window.aiManager.simulateMovement("down"));
    connectBtn.addEventListener("click", () => window.aiManager.connectToApi(apiEndpointInput.value));
    disconnectBtn.addEventListener("click", window.aiManager.disconnectFromApi);
    // Message initial
    window.aiManager.addLogMessage("Plateforme de test Pong AI initialisée");
}
// Initialiser l'interface utilisateur
document.addEventListener("DOMContentLoaded", initUI);
