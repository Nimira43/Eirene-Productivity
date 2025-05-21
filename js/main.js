const GAME_SETTINGS = {
  BALL: { x: 75, y: 75, speedX: 5, speedY: 7, radius: 10 },
  BRICK: { width: 80, height: 20, gap: 2, cols: 10, rows: 14 },
  PADDLE: { width: 100, thickness: 10, distanceFromEdge: 60, speed: 40, x: 400 },
}

let brickGrid = Array(GAME_SETTINGS.BRICK.cols * GAME_SETTINGS.BRICK.rows).fill(true)
let canvas, ctx

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
    PADDLE.x -= PADDLE.speed;
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

// function updateAll() {
//   moveAll()
//   drawAll()
// }

function ballReset() {
  GAME_SETTINGS.BALL.x = canvas.width / 2
  GAME_SETTINGS.BALL.y = canvas.height / 2
}

function moveBall() {
  let ball = GAME_SETTINGS.BALL
  ball.x += ball.speedX
  ball.y += ball.speedY

  if (ball.x < 0 || ball.x > canvas.width) ball.speedX *= -1
  if (ball.y < 0) ball.speedY *= -1
  if (ball.y > canvas.height) {
    ballReset()
    brickReset()
  }
}

function isBrickAtColRow(col, row) {
  if (
    col >= 0 &&
    col < BRICK_COLS &&
    row >= 0 &&
    row < BRICK_ROWS
  ) {
    let brickIndexUnderCoord = rowColToArrayIndex(col, row)
    return brickGrid[brickIndexUnderCoord]
  } else {
    return false
  }
}

function ballBrickHandling() {
  let ballBrickCol = Math.floor(ballX / BRICK_WIDTH)
  let ballBrickRow = Math.floor(ballY / BRICK_HEIGHT)
  let brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow) 
  
  if (
    ballBrickCol >= 0 &&
    ballBrickCol < BRICK_COLS &&
    ballBrickRow >= 0 &&
    ballBrickRow < BRICK_ROWS
  ) {
    if (isBrickAtColRow(ballBrickCol, ballBrickRow)) {
      brickGrid[brickIndexUnderBall] = false
      bricksLeft--
    
      let prevBallX = ballX - ballSpeedX
      let prevBallY = ballY - ballSpeedY
      let prevBrickCol = Math.floor(prevBallX / BRICK_WIDTH)
      let prevBrickRow = Math.floor(prevBallY / BRICK_HEIGHT)

      let bothTestsFailed = true

      if (prevBrickCol != ballBrickCol) {
        if (isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {
          ballSpeedX *= -1
          bothTestsFailed = false
        }
      }
      if (prevBrickRow != ballBrickRow) {
        if (isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {
          ballSpeedY *= -1
          bothTestsFailed = false
        }
      }
      if (bothTestsFailed) {
        ballSpeedX *= -1
        ballSpeedY *= -1
      }
    }
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
    ball.speedX = (ball.x - (paddle.x + paddle.width / 2)) * 0.35
  }
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
}

function gameLoop() {
  updateAll()
  drawGame()
  requestAnimationFrame(gameLoop) 
}

window.onload = initialiseGame