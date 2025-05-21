const GAME_SETTINGS = {
  BALL: { x: 75, y: 75, speedX: 2, speedY: 3, radius: 10 },
  BRICK: { width: 80, height: 20, gap: 2, cols: 10, rows: 14 },
  PADDLE: { width: 100, thickness: 10, distanceFromEdge: 60, speed: 70, x: 400 },
}

let brickGrid = Array(GAME_SETTINGS.BRICK.cols * GAME_SETTINGS.BRICK.rows).fill(true)
let canvas, ctx
let score = 0 
let lives = 5
let gameRunning = false

function initialiseGame() {
  canvas = document.getElementById('gameCanvas')
  ctx = canvas.getContext('2d')
  document.addEventListener('keydown', updatePaddleMovement)
  brickReset() 
  ballReset()
  gameLoop()
}

function updatePaddleMovement(event) {
  let { PADDLE } = GAME_SETTINGS
  
  if (event.key === 'ArrowLeft') {
    PADDLE.x -= PADDLE.speed
    PADDLE.x = Math.max(0, PADDLE.x)
  } 
  else if (event.key === 'ArrowRight') {
    PADDLE.x += PADDLE.speed
    PADDLE.x = Math.min(canvas.width - PADDLE.width, PADDLE.x)
  }
}
  
function brickReset() {
  brickGrid = brickGrid.map((_, i) => (Math.floor(i / GAME_SETTINGS.BRICK.cols) < 3 ? false : true))
}

function ballReset() {
  if (lives > 0) {
    GAME_SETTINGS.BALL.x = canvas.width / 2
    GAME_SETTINGS.BALL.y = canvas.height / 2
  } else {
    resetGame()
  }
}

function moveBall() {
  let ball = GAME_SETTINGS.BALL
  ball.x += ball.speedX
  ball.y += ball.speedY

  if (ball.x < 0 || ball.x > canvas.width) ball.speedX *= -1
  if (ball.y < 0) ball.speedY *= -1
  if (ball.y > canvas.height) {
    lives--
    ballReset()
  }
}

function checkBrickCollision() {
  let ball = GAME_SETTINGS.BALL
  let col = Math.floor(ball.x / GAME_SETTINGS.BRICK.width)
  let row = Math.floor(ball.y / GAME_SETTINGS.BRICK.height)
  let index = row * GAME_SETTINGS.BRICK.cols + col

  if (brickGrid[index]) {
    brickGrid[index] = false
    ball.speedY *= -1
    score++
  }
}

function checkPaddleCollision() {
  let ball = GAME_SETTINGS.BALL
  let paddle = GAME_SETTINGS.PADDLE
  let paddleTop = canvas.height - paddle.distanceFromEdge

  if (
    ball.y > paddleTop &&
    ball.y < paddleTop + paddle.thickness &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    ball.speedY *= -1
    
    let centreOfPaddleX = paddle.x + paddle.width / 2;
    let ballDistanceFromCentre = ball.x - centreOfPaddleX
    ball.speedX = ballDistanceFromCentre * 0.2
  }
}

function updateAll() {
  moveBall()
  checkBrickCollision()
  checkPaddleCollision()
}

function resetGame() {
  gameRunning = false
  score = 0
  lives = 5
  brickReset()
  ballReset()
  alert('You are dead. Press any key to start a new game...')
  document.addEventListener('keydown', initialiseGame, { once: true })
}

function drawHUD() {
  ctx.fillStyle = '#ffffff'
  ctx.font = '20px Arial'
  ctx.fillText(`Score: ${score}`, 20, 30)
  ctx.fillText(`Lives: ${lives}`, canvas.width - 100, 30)
}
  
function drawGame() {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = '#ffd700'
  ctx.beginPath()
  ctx.arc(
    GAME_SETTINGS.BALL.x,
    GAME_SETTINGS.BALL.y,
    GAME_SETTINGS.BALL.radius,
    0,
    Math.PI * 2
  )
  ctx.fill()

  ctx.fillStyle = '#fffcfa'
  ctx.fillRect(
    GAME_SETTINGS.PADDLE.x,
    canvas.height - GAME_SETTINGS.PADDLE.distanceFromEdge,
    GAME_SETTINGS.PADDLE.width,
    GAME_SETTINGS.PADDLE.thickness
  )

  brickGrid.forEach((brick, i) => {
    if (brick) {
      let col = i % GAME_SETTINGS.BRICK.cols
      let row = Math.floor(i / GAME_SETTINGS.BRICK.cols)
      ctx.fillStyle = '#ff4500'
      ctx.fillRect(
        GAME_SETTINGS.BRICK.width * col,
        GAME_SETTINGS.BRICK.height * row,
        GAME_SETTINGS.BRICK.width - GAME_SETTINGS.BRICK.gap,
        GAME_SETTINGS.BRICK.height - GAME_SETTINGS.BRICK.gap
      )
    }
  })
  drawHUD()
}

function gameLoop() {
  if (!gameRunning) return
  updateAll()
  drawGame()
  requestAnimationFrame(gameLoop) 
}

window.onload = initialiseGame