let ballX = 75
let canvas, ctx

window.onload = function () {
  canvas = document.getElementById('gameCanvas')
  ctx = canvas.getContext('2d')
  fps = 30
  setInterval(updateAll, 1000 / fps)
}

function updateAll() { 
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = 'white'
  ctx.beginPath()
  ctx.arc(ballX, 100, 10, 0, Math.PI * 2, true)
  ctx.fill()
}