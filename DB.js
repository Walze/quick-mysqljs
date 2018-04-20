const config_file = require('./config.json').dev

class Database {
  constructor(config, mysql) {

    this._connection = mysql.createConnection({
      host: config.host,
      user: config.username,
      password: config.password,
      database: config.database,
      port: config.port
    })

    this._mysql = mysql
  }

  // Adds WHERE AND to each prop of obj
  _where_replace(query, where) {
    let counter = 0
    let whereStart = query.indexOf('WHERE ?')

    if (whereStart > -1)
      for (let prop in where) {
        counter++

        whereStart = query.indexOf('WHERE ?')

        // remove 'WHERE ?'
        if (whereStart > -1)
          query = query.slice(0, whereStart + 6)

        if (counter >= Object.keys(where).length)
          query += `\`${prop}\` = '${where[prop]}'`
        else
          query += `\`${prop}\` = '${where[prop]}' AND `
      }

    return query
  }

  // Helper
  _callback_to_promise(error, result, resolve, reject) {
    if (error) reject(error)
    else resolve(result)
  }

  run(query, values = false) {
    return new Promise((resolve, reject) => {
      if (typeof values === 'object' || typeof values === 'array')
        this._connection.query(query, values, (error, result) => this._callback_to_promise(error, result, resolve, reject))

      else if (values === false)
        this._connection.query(query, (error, result) => this._callback_to_promise(error, result, resolve, reject))

      else {
        const error = new TypeError('Second parameter has to be either Object or Array')
        throw error
        reject(error)
      }
    })
  }

  // Quick Queries

  all(table) {
    const query = `SELECT * FROM ${table}`

    return this.run(query)
  }

  id(table, id) {
    const query = `SELECT * FROM ${table} WHERE id = ${id}`

    return this.run(query)
  }

  find(table, where) {
    let query = this._mysql.format(`SELECT * FROM ${table} WHERE ?`)
    query = this._where_replace(query, where)

    return this.run(query)
  }

  insert(table, set) {
    const query = this._mysql.format(`INSERT INTO ${table} SET ?`, set)

    return this.run(query)
  }

  update(table, set, where) {
    let query = this._mysql.format(`UPDATE ${table} SET ? WHERE ?`, set)
    query = this._where_replace(query, where)

    return this.run(query)
  }

  delete(table, where) {
    let query = this._mysql.format(`DELETE FROM ${table} WHERE ?`)
    query = this._where_replace(query, where)

    return this.run(query)
  }
}

module.exports = new Database(config_file, require('mysql'))
