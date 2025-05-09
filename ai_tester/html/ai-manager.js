"use strict";
// Variables globales
let apiEndpoint = null;
let isConnected = false;
let apiIntervalId = null;
let movementTimeoutId = null;
let lastApiCallTime = 0;
let currentMovementDirection = "none";
let connectionRetryCount = 0;
const MAX_RETRY_ATTEMPTS = 3;
let connectionRetryTimeout = null;
// Fonction pour ajouter un message au journal
function addLogMessage(message) {
    const timestamp = new Date().toLocaleTimeString();
    const logArea = document.getElementById("logArea");
    if (logArea) {
        logArea.value += `[${timestamp}] ${message}\n`;
        logArea.scrollTop = logArea.scrollHeight; // Auto-scroll
    }
}
// Fonction pour vérifier si l'API est connectée
function isApiConnected() {
    return isConnected;
}
// Fonction pour se déconnecter de l'API
function disconnectFromApi() {
    if (apiIntervalId) {
        clearInterval(apiIntervalId);
        apiIntervalId = null;
    }
    if (movementTimeoutId) {
        clearTimeout(movementTimeoutId);
        movementTimeoutId = null;
    }
    if (connectionRetryTimeout) {
        clearTimeout(connectionRetryTimeout);
        connectionRetryTimeout = null;
    }
    isConnected = false;
    apiEndpoint = null;
    currentMovementDirection = "none";
    connectionRetryCount = 0;
    // Mise à jour de l'interface
    const connectBtn = document.getElementById("connectBtn");
    const disconnectBtn = document.getElementById("disconnectBtn");
    const connectionStatus = document.getElementById("connectionStatus");
    if (connectBtn)
        connectBtn.style.display = "inline-block";
    if (disconnectBtn)
        disconnectBtn.style.display = "none";
    if (connectionStatus) {
        connectionStatus.textContent = "Déconnecté de l'API";
        connectionStatus.style.color = "#DC2626";
    }
    addLogMessage("Déconnecté de l'API");
}
// Fonction pour tester la connexion à l'API
function testApiConnection(endpoint) {
    // Préparer les données minimales pour tester la connexion
    const testData = {
        paddlePosition: 0,
        ballPosition: { x: 0, y: 0 },
        ballDirection: { x: 0, y: 0 },
    };
    // Utiliser POST au lieu de HEAD pour tester la connexion
    return fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
    })
        .then((response) => {
        if (response.ok) {
            return true;
        }
        else {
            // Extraire plus d'informations sur l'erreur
            const statusText = response.statusText || `Code ${response.status}`;
            throw new Error(`${statusText}`);
        }
    })
        .catch((error) => {
        throw error;
    });
}
// Fonction pour se connecter à l'API
function connectToApi(endpoint) {
    if (!endpoint) {
        addLogMessage("Erreur: URL de l'API non spécifiée");
        return;
    }
    endpoint = endpoint.trim();
    if (!endpoint.startsWith("http")) {
        endpoint = "http://" + endpoint;
    }
    apiEndpoint = endpoint;
    const connectionStatus = document.getElementById("connectionStatus");
    if (connectionStatus) {
        connectionStatus.textContent = `Tentative de connexion à ${apiEndpoint}...`;
        connectionStatus.style.color = "#F59E0B";
    }
    testApiConnection(apiEndpoint)
        .then(() => {
        isConnected = true;
        connectionRetryCount = 0;
        const connectBtn = document.getElementById("connectBtn");
        const disconnectBtn = document.getElementById("disconnectBtn");
        const connectionStatus = document.getElementById("connectionStatus");
        if (connectBtn)
            connectBtn.style.display = "none";
        if (disconnectBtn)
            disconnectBtn.style.display = "inline-block";
        if (connectionStatus) {
            connectionStatus.textContent = `Connecté à ${apiEndpoint}`;
            connectionStatus.style.color = "#10B981";
        }
        addLogMessage(`Connecté avec succès à l'API: ${apiEndpoint}`);
        startApiCalls();
    })
        .catch((error) => {
        addLogMessage(`Échec de connexion: ${error.message}`);
        connectionRetryCount++;
        if (connectionRetryCount < 5) {
            addLogMessage(`Nouvelle tentative dans 2 secondes... (${connectionRetryCount})`);
            connectionRetryTimeout = setTimeout(() => {
                connectToApi(endpoint);
            }, 2000);
        }
        else {
            addLogMessage("Échec de connexion après plusieurs tentatives.");
            disconnectFromApi();
        }
    });
}
// Fonction pour démarrer les appels périodiques à l'API
function startApiCalls() {
    // Arrêter tout intervalle existant
    if (apiIntervalId) {
        clearInterval(apiIntervalId);
    }
    // Appeler l'API immédiatement
    callApi();
    // Puis configurer l'intervalle pour les appels suivants (toutes les secondes)
    apiIntervalId = setInterval(() => {
        callApi();
    }, 1000);
}
// Fonction pour appeler l'API avec l'état actuel du jeu
function callApi() {
    if (!isConnected || !apiEndpoint)
        return;
    const currentTime = Date.now();
    lastApiCallTime = currentTime;
    // Obtenir l'état actuel du jeu
    const gameState = window.pongGame.getGameState();
    // Préparer les données à envoyer à l'API
    const requestData = {
        paddlePosition: gameState.paddlePosition,
        ballPosition: gameState.ballPosition,
        ballDirection: gameState.ballDirection,
    };
    // Appeler l'API
    fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
    })
        .then((response) => {
        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status} ${response.statusText || ""}`);
        }
        return response.json();
    })
        .then((data) => {
        // Traiter la réponse de l'API
        handleApiResponse(data);
    })
        .catch((error) => {
        addLogMessage(`Erreur lors de l'appel API: ${error.message}`);
        // Si l'erreur persiste, envisager de se déconnecter
        if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
            addLogMessage("Connexion perdue avec l'API");
            disconnectFromApi();
        }
    });
}
// Fonction pour traiter la réponse de l'API
function handleApiResponse(response) {
    // Vérifier si la réponse est valide
    if (!response || typeof response.direction === "undefined") {
        addLogMessage("Avertissement: Réponse API invalide ou incomplète");
        return;
    }
    const direction = response.direction;
    const duration = response.duration || 1000; // Par défaut 1 seconde si non spécifié
    // Arrêter tout mouvement en cours
    if (movementTimeoutId) {
        clearTimeout(movementTimeoutId);
        movementTimeoutId = null;
    }
    // Si la direction est "none", ne rien faire
    if (direction === "none") {
        currentMovementDirection = "none";
        addLogMessage("API: Aucun mouvement");
        return;
    }
    // Appliquer le mouvement
    currentMovementDirection = direction;
    applyMovement(direction);
    // Enregistrer l'action
    addLogMessage(`API: Mouvement ${direction} pendant ${duration}ms`);
    // Arrêter le mouvement après la durée spécifiée
    movementTimeoutId = setTimeout(() => {
        currentMovementDirection = "none";
        stopMovement();
        addLogMessage("Fin du mouvement");
    }, Math.min(duration, 1000)); // Limiter à 1 seconde maximum
}
// Fonction pour appliquer un mouvement
function applyMovement(direction) {
    if (direction === "up") {
        window.pongGame.setIsUpPressed(true);
        window.pongGame.setIsDownPressed(false);
    }
    else if (direction === "down") {
        window.pongGame.setIsUpPressed(false);
        window.pongGame.setIsDownPressed(true);
    }
}
// Fonction pour arrêter tout mouvement
function stopMovement() {
    window.pongGame.setIsUpPressed(false);
    window.pongGame.setIsDownPressed(false);
}
// Fonction pour simuler un mouvement manuellement
function simulateMovement(direction) {
    // Simuler une réponse API
    handleApiResponse({
        direction: direction,
        duration: 500, // Simuler un mouvement de 500ms
    });
    addLogMessage(`Simulation manuelle: Mouvement ${direction}`);
}
// Exporter les fonctions pour l'interface utilisateur
window.aiManager = {
    isConnected: isApiConnected,
    disconnectFromApi,
    connectToApi,
    simulateMovement,
    addLogMessage,
};
// Initialisation
document.addEventListener("DOMContentLoaded", () => {
    addLogMessage("AI Manager initialisé");
    addLogMessage("Format de données attendu par l'API: { direction: 'up'|'down'|'none', duration: number }");
    addLogMessage("Format de données envoyé à l'API: { paddlePosition: number, ballPosition: {x,y}, ballDirection: {x,y} }");
});
