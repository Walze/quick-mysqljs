const db = require('../DB')


function Crud_Listener(table, express_instance) {

  //all
  express_instance.get(`/${table}`, (req, res) => {
    db.all(table)
      .then(res.send)
      .catch(res.send)
  })

  //id
  express_instance.get(`/${table}/:id`, (req, res) => {
    db.id(table, req.params.id)
      .then(res.send)
      .catch(res.send)
  })

  //find
  express_instance.post(`/${table}/find`, (req, res) => {
    db.find(table, req.body)
      .then(res.send)
      .catch(res.send)
  })

  //insert
  express_instance.post(`/${table}`, (req, res) => {
    db.insert(table, req.body)
      .then(res.send)
      .catch(res.send)
  })

  //update
  express_instance.put(`/${table}/:id`, (req, res) => {
    db.update(table, req.body, { id: req.params.id })
      .then(res.send)
      .catch(res.send)
  })

  //delete
  express_instance.delete(`/${table}/:id`, (req, res) => {
    db.delete(table, { id: Number(req.params.id) })
      .then(res.send)
      .catch(res.send)
  })
}

module.exports = Crud_Listener