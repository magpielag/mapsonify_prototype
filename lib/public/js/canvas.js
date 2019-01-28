var canvas = document.getElementById('synthCanvas')
var canvasContext = canvas.getContext('2d')
canvasContext.strokeStyle = 'rgba(77, 6, 83, 1)'
canvasContext.lineCap = 'round'
canvasContext.lineJoin = 'round'
canvasContext.lineWidth = 8

const userCoords = { x: [], y: [] } // Object to store x and y coordinates of user path.
const mappingArray = mappingChange() // mappingChange changes the mapping profile and returns and array containing the mapping number and mouseEvent function for that mapping.
var mappingVal = '0' // Defaults to 0.
var mouseEventHandler = function () { } // Defaults to an empty function.

function getMapping (mapOpt) {
  // If an optional mapping value is given (i.e. the user wants a specific mapping function as the active, then set it. Else, just grab the current mapping.)
  if (mapOpt != null) {
    var changeArr = mappingChange(mapOpt)
  } else { changeArr = mappingChange() }
  mappingVal = changeArr[0]
  mouseEventHandler = changeArr[1]
}

$('#synthCanvas').ready(getMapping('1')) // When the canvas is loaded, set the mapping function to be == 1.

var mouse = { // Mouse object, could be class but I'm lazy.
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

function resetCanvas () { // Set the coordinates of the user input back to zero, then clear the canvas.
  userCoords.x.length = 0
  userCoords.y.length = 0
  canvasContext.clearRect(0, 0, canvas.width, canvas.height)
  $('#playButton').attr("disabled", false); // Set the button to be disabled/off until playback is finished.

}

$('#resetButton').click(function () { resetCanvas() }) // Listener to trigger reset.

canvas.addEventListener('mousedown', function (e) {
  // Get mouse position and set it to be down.
  userCoords.x = []
  userCoords.y = []
  mouse.down = true
  mouse.position.down = mouse.getPos(this, e)
  userCoords.x.push(mouse.position.down.x)
  userCoords.y.push(mouse.position.down.y)
  if (mappingVal !== '4') {
    audio.play()
    mouseEventHandler(mouse.position.down)
  }
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
    if (mappingVal !== '4') { mouseEventHandler(mouse.position.up) }
  }
})

canvas.addEventListener('mouseup', function (e) {
  mouse.down = false
  if (mappingVal !== '4') {
    audio.stop()
  } else {
    mouseEventHandler(userCoords)
  }
})
