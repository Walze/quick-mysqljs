const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

const log = require('better-log')
log.setConfig({ depth: 2 })


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors)
app.use(morgan('tiny'))

const PORT = 3001
app.listen(PORT, e => console.log(`Listening on port ${PORT}`))


// Example
const db = require('./DB')
db.run('SELECT 2 * 2 as result').then(log)





function cors(req, res, next) {
  res.header("Content-Type", "application/json")
  res.header("Access-Control-Allow-Origin", "*")
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
}