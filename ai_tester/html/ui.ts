// Interfaces for window extensions
interface Window {
  aiManager: AIManager
}

// Interface for the AI Manager
interface AIManager {
  isConnected: () => boolean
  disconnectFromApi: () => void
  connectToApi: (endpoint: string) => void
  simulateMovement: (direction: "up" | "down") => void
  addLogMessage: (message: string) => void
}

// Éléments du DOM
const logArea = document.getElementById("logArea") as HTMLTextAreaElement
const apiEndpointInput = document.getElementById("apiEndpoint") as HTMLInputElement
const connectBtn = document.getElementById("connectBtn") as HTMLButtonElement
const disconnectBtn = document.getElementById("disconnectBtn") as HTMLButtonElement
const clearLogBtn = document.getElementById("clearLogBtn") as HTMLButtonElement
const manualModeBtn = document.getElementById("manualModeBtn") as HTMLButtonElement
const apiModeBtn = document.getElementById("apiModeBtn") as HTMLButtonElement
const manualControls = document.getElementById("manualControls") as HTMLDivElement
const apiControls = document.getElementById("apiControls") as HTMLDivElement
const moveUpBtn = document.getElementById("moveUpBtn") as HTMLButtonElement
const moveDownBtn = document.getElementById("moveDownBtn") as HTMLButtonElement

// Fonction pour effacer le journal
function clearLog(): void {
  logArea.value = ""
}

// Fonction pour basculer entre les modes
function switchToManualMode(): void {
  manualModeBtn.classList.remove("button-outline")
  apiModeBtn.classList.add("button-outline")
  manualControls.style.display = "block"
  apiControls.style.display = "none"

  // Si connecté à l'API, se déconnecter
  if (window.aiManager.isConnected()) {
    window.aiManager.disconnectFromApi()
  }
}

function switchToApiMode(): void {
  apiModeBtn.classList.remove("button-outline")
  manualModeBtn.classList.add("button-outline")
  apiControls.style.display = "block"
  manualControls.style.display = "none"
}

// Initialisation de l'interface utilisateur
function initUI(): void {
  // Boutons de l'interface
  clearLogBtn.addEventListener("click", clearLog)
  manualModeBtn.addEventListener("click", switchToManualMode)
  apiModeBtn.addEventListener("click", switchToApiMode)
  moveUpBtn.addEventListener("click", () => window.aiManager.simulateMovement("up"))
  moveDownBtn.addEventListener("click", () => window.aiManager.simulateMovement("down"))
  connectBtn.addEventListener("click", () => window.aiManager.connectToApi(apiEndpointInput.value))
  disconnectBtn.addEventListener("click", window.aiManager.disconnectFromApi)

  // Message initial
  window.aiManager.addLogMessage("Plateforme de test Pong AI initialisée")
}

// Initialiser l'interface utilisateur
document.addEventListener("DOMContentLoaded", initUI)
