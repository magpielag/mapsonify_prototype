const express = require('express')
const fs = require('fs') // File save features, will be replaced by redis storing.
var redis = require('redis')
var client = redis.createClient(process.env.REDIS_URL)
// var redis = new Redis(process.env.REDIS_URL)

const app = express() // Create express variable.
var path = require('path')
var playIdx = 0
const jsonFiles = ['corner', 'triangle', 'circle', 'route1', 'route2', 'route3']

client.on('connect', function () {
  console.log('Redis client connected')
})

client.set('Test key', 'Test Value', redis.print)

app.use(express.static(path.join(__dirname, '/public')))
app.use('/public/js', express.static(path.join(__dirname, '/public/js')))
app.use(express.json()) // Used instead of the bodyParser, does the same thing.

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/html/frontpage.html'))
}) // Default get function, when the page loads - POST the frontpage.html file.

app.get('/app', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/html/app.html'))
}) // Alternatively, jump straight ot the app page if /app is used.

app.post('/app/submit', function (req, res) {
  let jsonOut = JSON.stringify(req.body) // Get the body of the request (json obj)
  fs.writeFileSync(path.join(__dirname, 'jsonSubmissions/', ('submission' + '.json')), jsonOut)
  playIdx++
})

app.get('/app/play', function (req, res) {
  if (playIdx > jsonFiles.length) { res.send('Out of files!')
  } else {
    console.log(jsonFiles[playIdx])
    let requiredPath = path.join(__dirname, 'public/json', (jsonFiles[playIdx] + '.json'))
    fs.readFile(requiredPath, 'utf8', function (err, data) {
      if (!err) {
        res.send(data)
      } else {
        res.end(`Error: ${err}`)
      }
    })
  }
})

app.listen(process.env.PORT || 5000) // Listen on the environment port or on lh:5000.
