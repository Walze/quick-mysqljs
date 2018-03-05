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

    const _queryPromiseHandler = (query, params) => {
      if (!params.length) params = false

      return new Promise((resolve, reject) =>

        this.query(query, params).then((err, result) => {
          if (err) reject(err)
          else resolve(result)
        })

      )
    }

    this.queryPromiseHandler = (query, ...params) => _queryPromiseHandler(query, params)
    this.getConnection = callback => callback(_connection)
    this._mysql = mysql
  }

  query(query, params = false) {
    return new Promise((resolve, reject) =>
      this.getConnection(connection => {

        const callback = (err, result) => {
          if (err) reject(err)
          else resolve(result)
        }

        if (typeof params === 'object')
          connection.query(query, params, (err, result) => callback(err, result))

        else if (params === false)
          connection.query(query, (err, result) => callback(err, result))

        else
          throw new error('Wrong type on 2nd param.')

      })
    )
  }

  all(table) {
    const query = `SELECT * FROM ${table}`

    return this.queryPromiseHandler(query)
  }

  id(table, id) {
    const query = `SELECT * FROM ${table} WHERE id = ${id}`

    return this.queryPromiseHandler(query)
  }

  find(table, where) {
    const query = `SELECT * FROM ${table} WHERE ?`

    return this.queryPromiseHandler(query, where)
  }

  insert(table, what) {
    const query = `INSERT INTO ${table} SET ?`

    return this.queryPromiseHandler(query, what)
  }

  update(table, set, where) {
    const query = this._mysql.format(`UPDATE ${table} SET ? WHERE ?`, [set, where])
    console.log(query)
    return this.queryPromiseHandler(query)
  }

  delete(table, where) {
    const query = `DELETE FROM ${table} WHERE ?`

    return this.queryPromiseHandler(query, where)
  }
}

module.exports = new Database(configFile, require('mysql'))