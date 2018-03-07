const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const crud = require('./CrudListener')
const db = require('./DB')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
  res.header("Content-Type", "application/json")
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

const PORT = 3000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
app.get('/', (req, res) => res.send("Got /"))


const tables = ['tablename']

tables.map(table => crud(table, app))
