const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const db = require('./DB')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(function (req, res, next) {
  res.header("Content-Type", "application/json")
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

const PORT = 3000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))



app.get('/', (req, res) => res.send("Got /"))




let tables = ['categoria']

tables.map(table => controller(table))


//crud
function controller(table) {
  app.get(`/${table}`, (req, res) => {
    db.all(table)
      .then(result => res.send(result))
      .catch(err => res.send(err))
  })

  app.get(`/${table}/:id`, (req, res) => {
    db.id(table, req.params.id)
      .then(result => res.send(result))
      .catch(err => res.send(err))
  })

  app.post(`/${table}/find`, (req, res) => {
    db.find(table, req.body)
      .then(result => res.send(result))
      .catch(err => res.send(err))
  })

  app.post(`/${table}`, (req, res) => {
    db.insert(table, req.body)
      .then(result => res.send(result))
      .catch(err => res.send(err))
  })

  app.put(`/${table}/:id`, (req, res) => {
    db.update(table, req.body, { id: req.params.id })
      .then(result => res.send(result))
      .catch(err => res.send(err))
  })

  app.delete(`/${table}/:id`, (req, res) => {
    db.delete(table, req.params.id)
      .then(result => res.send(result))
      .catch(err => res.send(err))
  })
}
