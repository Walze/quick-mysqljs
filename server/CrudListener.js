const db = require('./DB')


function CrudListener(table, expressApp) {

  //all
  expressApp.get(`/${table}`, (req, res) => {
    db.all(table)
      .then(result => res.send(result))
      .catch(err => res.send(err))
  })

  //id
  expressApp.get(`/${table}/:id`, (req, res) => {
    db.id(table, req.params.id)
      .then(result => res.send(result))
      .catch(err => res.send(err))
  })

  //find
  expressApp.post(`/${table}/find`, (req, res) => {
    db.find(table, req.body)
      .then(result => res.send(result))
      .catch(err => res.send(err))
  })

  //insert
  expressApp.post(`/${table}`, (req, res) => {
    db.insert(table, req.body)
      .then(result => res.send(result))
      .catch(err => res.send(err))
  })

  //update
  expressApp.put(`/${table}/:id`, (req, res) => {
    db.update(table, req.body, { id: req.params.id })
      .then(result => res.send(result))
      .catch(err => res.send(err))
  })

  //delete
  expressApp.delete(`/${table}/:id`, (req, res) => {
    db.delete(table, { id: req.params.id })
      .then(result => res.send(result))
      .catch(err => res.send(err))
  })
}

module.exports = CrudListener