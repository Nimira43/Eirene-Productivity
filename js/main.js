let ballX = 75
let ballY = 75
let ballSpeedX = 5
let ballSpeedY = 7

const BRICK_WIDTH = 100
const BRICK_HEIGHT = 50
const BRICK_GAP = 2
const BRICK_COLS = 8
const BRICK_ROWS = 4

let brickGrid = new Array(BRICK_COLS * BRICK_ROWS)

const PADDLE_WIDTH = 100
const PADDLE_THICKNESS = 10
const PADDLE_DISTANCE_FROM_EDGE = 60
const PADDLE_SPEED = 30 // key based movement.
let paddleX = 400
let canvas, ctx
let mouseX = 0
let mouseY = 0

function updateMousePos(event) {
  let rect = canvas.getBoundingClientRect()
  let root = document.documentElement
  mouseX = event.clientX = rect.left - root.scrollLeft
  mouseY = event.clientY = rect.top - root.scrollTop
  paddleX = mouseX - PADDLE_WIDTH / 2
}

function updatePaddleMovement(event) {
  if (event.key === 'ArrowLeft') {
    paddleX -= PADDLE_SPEED
  } else if (event.key === 'ArrowRight') {
    paddleX += PADDLE_SPEED
  }
  if (paddleX < 0) {
    paddleX = 0
  } else if (paddleX > canvas.width - PADDLE_WIDTH) {
    paddleX = canvas.width - PADDLE_WIDTH
  }
}

function brickReset() {
  for (var i = 0; i < BRICK_COLS * BRICK_ROWS; i++) {
    if (Math.random() < 0.5) {
      brickGrid[i] = true
    } else {
      brickGrid[i] = false
    }
  }
}

window.onload = function () {
  canvas = document.getElementById('gameCanvas')
  ctx = canvas.getContext('2d')
  let fps = 30
  setInterval(updateAll, 1000 / fps)

  canvas.addEventListener('mousemove', updateMousePos)    
  document.addEventListener('keydown', updatePaddleMovement)

  brickReset() 
}

function updateAll() {
  moveAll()
  drawAll()
}

function ballReset() {
  ballX = canvas.width / 2
  ballY = canvas.height / 2
}

function moveAll() {
  ballX += ballSpeedX
  ballY += ballSpeedY

  if (ballX < 0) ballSpeedX *= -1
  if (ballX > canvas.width) ballSpeedX *= -1
  if (ballY < 0) ballSpeedY *= -1
  if (ballY > canvas.height) ballReset()
  
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
  }
}

function drawBricks() {
  for (let eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
    for (let eachCol = 0; eachCol < BRICK_COLS; eachCol++) {
      if (brickGrid[eachCol]) {
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

  let mouseBrickCol = mouseX / BRICK_WIDTH
  let mouseBrickRow = mouseY / BRICK_HEIGHT
  colourText(mouseBrickCol + ',' + mouseBrickRow, mouseX, mouseY, '#fff')
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