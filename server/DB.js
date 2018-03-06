const configFile = require('./config.json').dev

class Database {
  constructor(config, mysql) {

    const _connection = mysql.createConnection({
      host: config.host,
      user: config.username,
      password: config.password,
      database: config.database,
      port: config.port
    })

    this.getConnection = callback => callback(_connection)
    this._mysql = mysql
  }

  run(query, ...params) {
    if (!params.length) params = false

    return new Promise((resolve, reject) =>
      this._query(query, params).then((err, result) => this._promiseRejRes(err, result))
    )
  }

  _promiseRejRes(err, result) {
    if (err) reject(err)
    else resolve(result)
  }

  get mysql() {
    return this._mysql
  }

  _query(query, params = false) {
    return new Promise((resolve, reject) =>
      this.getConnection(connection => {

        if (typeof params === 'object')
          connection.query(query, params, (err, result) => this._promiseRejRes(err, result))

        else if (params === false)
          connection.query(query, (err, result) => this._promiseRejRes(err, result))

        else
          throw new error('Wrong type on 2nd param.')

      })
    )
  }

  all(table) {
    const query = `SELECT * FROM ${table}`

    return this.run(query)
  }

  id(table, id) {
    const query = `SELECT * FROM ${table} WHERE id = ${id}`

    return this.run(query)
  }

  find(table, where) {
    const query = this.mysql.format(`SELECT * FROM ${table} WHERE ?`, where)

    return this.run(query)
  }

  insert(table, what) {
    const query = this.mysql.format(`INSERT INTO ${table} SET ?`, what)

    return this.run(query)
  }

  update(table, set, where) {
    const query = this.mysql.format(`UPDATE ${table} SET ? WHERE ?`, [set, where])

    return this.run(query)
  }

  delete(table, where) {
    const query = this.mysql.format(`DELETE FROM ${table} WHERE ?`, where)

    return this.run(query)
  }
}

module.exports = new Database(configFile, require('mysql'))