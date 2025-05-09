// Interfaces for window extensions
interface Window {
  pongGame: PongGame
}

// Interfaces for game objects
interface Vector2D {
  x: number
  y: number
}

interface ScoreState {
  player: number
  ai: number
}

interface GameState {
  paddlePosition: number
  aiPaddlePosition: number
  ballPosition: Vector2D
  ballDirection: Vector2D
  score: ScoreState
}

interface PongGame {
  paddlePosition: number
  aiPaddlePosition: number
  ballPosition: Vector2D
  ballDirection: Vector2D
  score: ScoreState
  isUpPressed: boolean
  isDownPressed: boolean
  resetBall: () => void
  startGame: () => void
  stopGame: () => void
  setIsUpPressed: (value: boolean) => void
  setIsDownPressed: (value: boolean) => void
  getGameState: () => GameState
}

// Constantes du jeu
const PADDLE_HEIGHT: number = 100
const PADDLE_WIDTH: number = 10
const BALL_SIZE: number = 10
const GAME_HEIGHT: number = 600
const GAME_WIDTH: number = 800
const PADDLE_SPEED: number = 5 // Vitesse de déplacement du paddle

// État du jeu
let paddlePosition = 250
let aiPaddlePosition = 250
let ballPosition: Vector2D = { x: 400, y: 300 }
let ballDirection: Vector2D = { x: 5, y: 5 }
const score: ScoreState = { player: 0, ai: 0 }
let isUpPressed = false
let isDownPressed = false
let isWUpPressed = false
let isSDownPressed = false
let gameLoopId: number | null = null

// Éléments du DOM
const canvas = document.getElementById("pongCanvas") as HTMLCanvasElement
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

// Fonction pour réinitialiser la balle
function resetBall(): void {
  ballPosition = { x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 }
  ballDirection = {
    x: (Math.random() > 0.5 ? 1 : -1) * 4,
    y: (Math.random() > 0.5 ? 1 : -1) * 4,
  }
}

// Fonction pour mettre à jour le jeu
function updateGame(): void {
  // Gestion des entrées clavier pour le paddle du joueur
  if (isUpPressed && paddlePosition > 0) {
    paddlePosition = Math.max(paddlePosition - PADDLE_SPEED, 0)
  }
  if (isDownPressed && paddlePosition < GAME_HEIGHT - PADDLE_HEIGHT) {
    paddlePosition = Math.min(paddlePosition + PADDLE_SPEED, GAME_HEIGHT - PADDLE_HEIGHT)
  }

  // Gestion des entrées clavier pour le paddle du joueur
  if (isWUpPressed && aiPaddlePosition > 0) {
    aiPaddlePosition = Math.max(aiPaddlePosition - PADDLE_SPEED, 0)
  }
  if (isSDownPressed && aiPaddlePosition < GAME_HEIGHT - PADDLE_HEIGHT) {
    aiPaddlePosition = Math.min(aiPaddlePosition + PADDLE_SPEED, GAME_HEIGHT - PADDLE_HEIGHT)
  }

  // Déplacement de la balle
  ballPosition.x += ballDirection.x
  ballPosition.y += ballDirection.y

//  Mouvement de l'IA (suit la balle)
  const aiTarget: number = ballPosition.y - PADDLE_HEIGHT / 2
  if (aiPaddlePosition < aiTarget && aiPaddlePosition < GAME_HEIGHT - PADDLE_HEIGHT) {
    aiPaddlePosition = Math.min(aiPaddlePosition + 4.5, GAME_HEIGHT - PADDLE_HEIGHT)
  } else if (aiPaddlePosition > aiTarget && aiPaddlePosition > 0) {
    aiPaddlePosition = Math.max(aiPaddlePosition - 4.5, 0)
  }

  // Collision de la balle avec le haut et le bas
  if (ballPosition.y <= 0 || ballPosition.y >= GAME_HEIGHT - BALL_SIZE) {
    ballDirection.y = -ballDirection.y
  }

  // Collision de la balle avec les paddles
  if (
    // Paddle gauche (joueur)
    (ballPosition.x <= PADDLE_WIDTH &&
      ballPosition.y >= aiPaddlePosition &&
      ballPosition.y <= aiPaddlePosition + PADDLE_HEIGHT) ||
    // Paddle droit (IA)
    (ballPosition.x >= GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
      ballPosition.y >= paddlePosition &&
      ballPosition.y <= paddlePosition + PADDLE_HEIGHT)
  ) {
    ballDirection.x = -ballDirection.x
  }

  // Balle hors limites
  if (ballPosition.x <= 0) {
    // L'IA marque
    score.ai += 1
    resetBall()
  } else if (ballPosition.x >= GAME_WIDTH) {
    // Le joueur marque
    score.player += 1
    resetBall()
  }

  // Dessiner le jeu
  drawGame()

  // Continuer la boucle de jeu
  gameLoopId = requestAnimationFrame(updateGame)
}

// Fonction pour dessiner le jeu
function drawGame(): void {
  // Effacer le canvas
  ctx.fillStyle = "#111"
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

  // Dessiner la ligne centrale
  ctx.strokeStyle = "#333"
  ctx.setLineDash([5, 5])
  ctx.beginPath()
  ctx.moveTo(GAME_WIDTH / 2, 0)
  ctx.lineTo(GAME_WIDTH / 2, GAME_HEIGHT)
  ctx.stroke()
  ctx.setLineDash([])

  // Dessiner les paddles
  ctx.fillStyle = "#fff"
  // Paddle du joueur
  ctx.fillRect(0, aiPaddlePosition, PADDLE_WIDTH, PADDLE_HEIGHT)
  // Paddle de l'IA
  ctx.fillRect(GAME_WIDTH - PADDLE_WIDTH, paddlePosition, PADDLE_WIDTH, PADDLE_HEIGHT)

  // Dessiner la balle
  ctx.fillRect(ballPosition.x, ballPosition.y, BALL_SIZE, BALL_SIZE)

  // Dessiner le score
  ctx.font = "24px Arial"
  ctx.fillText(score.player.toString(), GAME_WIDTH / 4, 30)
  ctx.fillText(score.ai.toString(), (GAME_WIDTH / 4) * 3, 30)
}

// Gestionnaires d'événements pour les touches du clavier
function handleKeyDown(e: KeyboardEvent): void {
  const key = e.key.toLowerCase()

  if (key === "arrowup") {
    isUpPressed = true
  } else if (key === "arrowdown") {
    isDownPressed = true
  } else if (key === "w") {
    isWUpPressed = true
  } else if (key === "s") {
    isSDownPressed = true
  }
}

function handleKeyUp(e: KeyboardEvent): void {
  const key = e.key.toLowerCase()

  if (key === "arrowup") {
    isUpPressed = false
  } else if (key === "arrowdown") {
    isDownPressed = false
  } else if (key === "w") {
    isWUpPressed = false
  } else if (key === "s") {
    isSDownPressed = false
  }
}


// Ajouter les écouteurs d'événements pour le clavier
document.addEventListener("keydown", handleKeyDown)
document.addEventListener("keyup", handleKeyUp)

// Fonction pour démarrer le jeu
function startGame(): void {
  // Démarrer la boucle de jeu
  gameLoopId = requestAnimationFrame(updateGame)
}

// Fonction pour arrêter le jeu
function stopGame(): void {
  if (gameLoopId) {
    cancelAnimationFrame(gameLoopId)
    gameLoopId = null
  }
}

// Nettoyage lors de la fermeture de la page
window.addEventListener("beforeunload", () => {
  document.removeEventListener("keydown", handleKeyDown)
  document.removeEventListener("keyup", handleKeyUp)
  stopGame()
})

// Exporter les fonctions et variables pour les autres modules
window.pongGame = {
  paddlePosition,
  aiPaddlePosition,
  ballPosition,
  ballDirection,
  score,
  isUpPressed,
  isDownPressed,
  resetBall,
  startGame,
  stopGame,
  setIsUpPressed: (value: boolean) => {
    isUpPressed = value
  },
  setIsDownPressed: (value: boolean) => {
    isDownPressed = value
  },
  getGameState: () => ({
    paddlePosition,
    aiPaddlePosition,
    ballPosition,
    ballDirection,
    score,
  }),
}

// Démarrer le jeu automatiquement
startGame()
