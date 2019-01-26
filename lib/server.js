const express = require('express')
// const fs = require('fs')
const app = express() // Create express variable.
var path = require('path')

app.use(express.static(path.join(__dirname, '/public')))
app.use(express.json()) // Used instead of the bodyParser, does the same thing.

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/html/frontpage.html'))
}) // Default get function, when the page loads - POST the frontpage.html file.

app.get('/app', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/html/app.html'))
}) // Alternatively, jump straight ot the app page if /app is used.

app.listen(process.env.PORT || 5000) // Listen on the environment port or on lh:5000.
