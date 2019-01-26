var canvas = document.getElementById('synthCanvas')
var canvasContext = canvas.getContext('2d')
canvasContext.strokeStyle = 'rgba(77, 6, 83, 1)'
canvasContext.lineCap = 'round'
canvasContext.lineJoin = 'round'
canvasContext.lineWidth = 8

const userCoords = { x: [], y: [] } // Object to store x and y coordinates of user path.
var mouse = {
  position: {
    down: { x: 0, y: 0 },
    up: { x: 0, y: 0 }
  },
  down: false,
  getPos: function (e, evt) {
    var rect = e.getBoundingClientRect()
    var root = document.documentElement
    if (this.down === true) {
      this.position.down.x = evt.clientX - rect.left - root.scrollLeft
      this.position.down.y = evt.clientY - rect.top - root.scrollTop
      return this.position.down
    } else {
      this.position.up.x = evt.clientX - rect.left - root.scrollLeft
      this.position.up.y = evt.clientY - rect.top - root.scrollTop
      return this.position.up
    }
  }
}


function resetCanvas () {
  userCoords.x.length = 0
  userCoords.y.length = 0
  canvasContext.clearRect(0, 0, canvas.width, canvas.height)
}


canvas.addEventListener('mousedown', function (e) {
  // Get mouse position and set it to be down.
  audio.play()
  mouse.down = true
  mouse.position.down = mouse.getPos(this, e)
  mouseEventHandler(mouse.position.down)
  canvasContext.beginPath()
  canvasContext.moveTo(mouse.position.down.x, mouse.position.down.y)
})

canvas.addEventListener('mousemove', function (e) {
  if (mouse.down) {
    mouse.position.up = mouse.getPos(this, e)
    userCoords.x.push(mouse.position.up.x)
    userCoords.y.push(mouse.position.up.y)
    canvasContext.lineTo(mouse.position.up.x, mouse.position.up.y)
    canvasContext.stroke()
    mouseEventHandler(mouse.position.up)
  }
})

canvas.addEventListener('mouseup', function (e) {
  mouse.down = false
  audio.stop()
})
