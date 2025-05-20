let ballX = 75
let ballY = 75
let ballSpeedX = 5
let ballSpeedY = 7
let canvas, ctx
let paddleX = 400
const PADDLE_WIDTH = 100
const PADDLE_THICKNESS = 10

function updateMousePos(event) {
  let rect = canvas.getBoundingClientRect()
  let root = document.documentElement()
  let mouseX = event.clientX = rect.left - root.scrollLeft
  paddleX = mouseX - PADDLE_WIDTH / 2
}


window.onload = function () {
  canvas = document.getElementById('gameCanvas')
  ctx = canvas.getContext('2d')
  fps = 30
  setInterval(updateAll, 1000 / fps)
}

function updateAll() {
  moveAll()
  drawAll()
}

function moveAll() {
  ballX += ballSpeedX
  ballY += ballSpeedY

  if (ballX < 0) ballSpeedX *= -1
  if (ballX > canvas.width) ballSpeedX *= -1
  if (ballY < 0) ballSpeedY *= -1
  if (ballY > canvas.height) ballSpeedY *= -1
}

function drawAll() {
  colourRect(0, 0, canvas.width, canvas.height, '#000')
  colourCircle(ballX, ballY, 10, '#fff')
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