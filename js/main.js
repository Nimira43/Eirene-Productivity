let ballX = 75
let ballY = 75
let ballSpeedX = 5
let ballSpeedY = 7

const PADDLE_WIDTH = 100
const PADDLE_THICKNESS = 10
const PADDLE_DISTANCE_FROM_EDGE = 60
let paddleX = 400
let canvas, ctx

function updateMousePos(event) {
  let rect = canvas.getBoundingClientRect()
  let root = document.documentElement
  let mouseX = event.clientX = rect.left - root.scrollLeft
  paddleX = mouseX - PADDLE_WIDTH / 2
}

window.onload = function () {
  canvas = document.getElementById('gameCanvas')
  ctx = canvas.getContext('2d')
  let fps = 30
  setInterval(updateAll, 1000 / fps)

  canvas.addEventListener('mousemove', updateMousePos)
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
}

function drawAll() {
  colourRect(0, 0, canvas.width, canvas.height, '#000')
  colourCircle(ballX, ballY, 10, '#fff')

  colourRect(paddleX, canvas.height - PADDLE_THICKNESS, PADDLE_WIDTH, PADDLE_THICKNESS, '#fff')
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