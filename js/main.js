let ballX = 75
let canvas, ctx

window.onload = function () {
  canvas = document.getElementById('gameCanvas')
  ctx = canvas.getContext('2d')
  fps = 30
  setInterval(updateAll, 1000 / fps)
}

function updateAll() { }