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

  get mysql() {
    return this._mysql
  }

  get connection() {
    return this._connection
  }

  // Adds WHERE AND to each prop of obj
  _where_replace(query, where) {
    let counter = 0

    for (let prop in where) {
      counter++

      let whereStart = query.indexOf('WHERE ?')

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

  _query(query, params = false) {
    return new Promise((resolve, reject) => {
      if (typeof params === 'object')
        this.connection.query(query, params, (error, result) => this._callback_to_promise(error, result, resolve, reject))

      else if (params === false)
        this.connection.query(query, (error, result) => this._callback_to_promise(error, result, resolve, reject))

      else throw new error('Wrong type on 2nd param')
    })
  }

  run(query, ...params) {
    if (!params.length) params = false
    return this._query(query, params)
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
    let query = this.mysql.format(`SELECT * FROM ${table} WHERE ?`)
    query = this._where_replace(query, where)

    return this.run(query)
  }

  insert(table, set) {
    const query = this.mysql.format(`INSERT INTO ${table} SET ?`, set)

    return this.run(query)
  }

  update(table, set, where) {
    let query = this.mysql.format(`UPDATE ${table} SET ? WHERE ?`, set)
    query = this._where_replace(query, where)

    return this.run(query)
  }

  delete(table, where) {
    let query = this.mysql.format(`DELETE FROM ${table} WHERE ?`)
    query = this._where_replace(query, where)

    return this.run(query)
  }
}

module.exports = new Database(config_file, require('mysql'))
