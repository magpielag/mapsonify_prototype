// TODO: Change playidx to be an object containing 4 ints, one for each mapping.

const express = require('express')
const fs = require('fs') // File save features, will be replaced by redis storing.
var redis = require('redis')
var client = redis.createClient(process.env.REDIS_URL)
const uuid = require('uuid/v1')
// var redis = new Redis(process.env.REDIS_URL)

const app = express() // Create express variable.
var path = require('path')
var playIdx = { '1': 0, '2': 0, '3': 0, '4': 0 }
var activeMapping = '1'
const jsonFiles = ['corner', 'triangle', 'circle', 'route1', 'route2', 'route3']
var entry = ''

client.on('connect', function () {
  console.log('Redis client connected')
})

function store (jsonToStore) {
  // Input is json of { x: [...], y: [...] }
  // Sets a hash table belonging to the entry uuid - defining the user start time.
  // Each entry in the hash has another uuid time stamp, containing the coordinates.
  jsonToStore.activeMapping = activeMapping
  client.hset(entry, uuid(), JSON.stringify(jsonToStore))
}

app.use(express.static(path.join(__dirname, '/public')))
app.use('/public/js', express.static(path.join(__dirname, '/public/js')))
app.use(express.json()) // Used instead of the bodyParser, does the same thing.

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/html/frontpage.html'))
}) // Default get function, when the page loads - POST the frontpage.html file.

app.get('/app', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/html/app.html'))
  entry = uuid()
}) // Alternatively, jump straight ot the app page if /app is used.

app.post('/app/submit', function (req, res, next) {
  // Return a 500 status error to the ajax post if trying to submit more than 6 submissions per mapping.
  var coordData = req.body
  if (playIdx[activeMapping] > 5) {
    res.status(500).send('Too many submits for this mapping!')
  } else {
    store(coordData)
    playIdx[activeMapping]++
  }
})

app.post('/app/updatemap', function (req, res) {
  var newMappingVal = req.body.mapping
  activeMapping = newMappingVal
})

app.get('/app/play', function (req, res, next) {
  // Do not play if the active index (index assigned to the mapping) is higher than 5 (used all json files already)
  var activeIdx = playIdx[activeMapping]
  if (activeIdx > (jsonFiles.length - 1)) {
    setImmediate(() => { next(new Error('Trying to get files that are unavailable, abort!')) })
  } else {
    let requiredPath = path.join(__dirname, 'public/json', (jsonFiles[activeIdx] + '.json'))
    fs.readFile(requiredPath, 'utf8', function (err, data) {
      if (!err) {
        res.send(data)
      } else {
        res.end(`Error: ${err}`) // Error for server side transaction (such as read file problems.)
      }
    })
  }
})

app.use(function (error, req, res, next) {
  res.json({ error: error.message })
})

app.listen(process.env.PORT || 5000) // Listen on the environment port or on lh:5000.
