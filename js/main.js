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
  brickGrid = brickGrid.map((_, i) => (Math.floor(i / GAME_SETTINGS.BRICK.cols) < 3 ? false : true));
}

// function updateAll() {
//   moveAll()
//   drawAll()
// }

function ballReset() {
  GAME_SETTINGS.BALL.x = canvas.width / 2;
  GAME_SETTINGS.BALL.y = canvas.height / 2;
}

function ballMove() {
  ballX += ballSpeedX
  ballY += ballSpeedY

  if (ballX < 0 && ballSpeedX < 0.0) ballSpeedX *= -1
  if (ballX > canvas.width && ballSpeedX > 0.0) ballSpeedX *= -1
  if (ballY < 0 && ballSpeedY < 0.0) ballSpeedY *= -1
  if (ballY > canvas.height) {
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

function ballPaddleHandling() {
  let paddleTopEdgeY = canvas.height - PADDLE_DISTANCE_FROM_EDGE
  let paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS
  let paddleLeftEdgeX = paddleX
  let paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH

  if (
    ballY > paddleTopEdgeY &&
    ballY < paddleBottomEdgeY &&
    ballX > paddleLeftEdgeX &&
    ballX < paddleRightEdgeX
  ) {
    ballSpeedY *= -1

    let centreOfPaddleX = paddleX + PADDLE_WIDTH / 2
    let ballDistanceFromPaddleCentreX = ballX - centreOfPaddleX
    ballSpeedX = ballDistanceFromPaddleCentreX * 0.35

    if (bricksLeft == 0) {
      brickReset()
    }
  } 
}
  
function moveAll() {
  ballMove()
  ballBrickHandling()
  ballPaddleHandling()
}
  
function rowColToArrayIndex(col, row) {
  return col + BRICK_COLS * row
}

function drawBricks() {
  for (let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
    for (let eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
      let arrayIndex = rowColToArrayIndex(eachCol, eachRow)
      if (brickGrid[arrayIndex]) {
        colourRect(
          BRICK_WIDTH * eachCol,
          BRICK_HEIGHT * eachRow,
          BRICK_WIDTH - BRICK_GAP,
          BRICK_HEIGHT - BRICK_GAP,
          '#ff4500'
        )
      }
    }
  }  
}

function drawAll() {
  colourRect(0, 0, canvas.width, canvas.height, '#000')
  colourCircle(ballX, ballY, 10, '#ffd700')
  colourRect(paddleX, canvas.height - PADDLE_DISTANCE_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, '#fffcfa')
  drawBricks()
}

function colourRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColour) {
  ctx.fillStyle = fillColour
  ctx.fillRect(topLeftX, topLeftY, boxWidth, boxHeight)
}

function colourCircle(centreX, centreY, radius, fillColour) {
  ctx.fillStyle = fillColour
  ctx.beginPath()
  ctx.arc(centreX, centreY, 10, 0, Math.PI * 2, true)
  ctx.fill()
}

function colourText(showWords, textX, textY, fillColour) {
  ctx.fillStyle = fillColour
  ctx.fillText(showWords, textX, textY)
}

function gameLoop() {
  updateAll()
  drawGame()
  requestAnimationFrame(gameLoop) 
}

window.onload = initialiseGame