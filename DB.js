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

  get mysql() {
    return this._mysql
  }

  _whereFix(query, where) {
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

  _promiseRejRes(err, result, resolve, reject) {
    if (err) reject(err)
    else resolve(result)
  }

  _query(query, params = false) {
    return new Promise((resolve, reject) =>
      this.getConnection(connection => {

        if (typeof params === 'object')
          connection.query(query, params, (err, result) => this._promiseRejRes(err, result, resolve, reject))

        else if (params === false)
          connection.query(query, (err, result) => this._promiseRejRes(err, result, resolve, reject))

        else
          throw new error('Wrong type on 2nd param.')
      })
    )
  }

  run(query, ...params) {
    if (!params.length) params = false

    return new Promise((resolve, reject) =>
      this._query(query, params)
        .then(result => this._promiseRejRes(false, result, resolve, reject))
        .catch(err => this._promiseRejRes(err, false, resolve, reject))
    )
  }

  all(table) {
    const query = `SELECT * FROM ${table}`

    return this.run(query)
  }

  id(table, id) {
    const query = `SELECT * FROM ${connection.escape(table)} WHERE id = ${id}`

    return this.run(query)
  }

  find(table, where) {
    let query = this.mysql.format(`SELECT * FROM ${table} WHERE ?`)
    query = this._whereFix(query, where)

    return this.run(query)
  }

  insert(table, set) {
    const query = this.mysql.format(`INSERT INTO ${table} SET ?`, set)

    return this.run(query)
  }

  update(table, set, where) {
    let query = this.mysql.format(`UPDATE ${table} SET ? WHERE ?`, set)
    query = this._whereFix(query, where)

    return this.run(query)
  }

  delete(table, where) {
    let query = this.mysql.format(`DELETE * FROM ${table} WHERE ?`)
    query = this._whereFix(query, where)

    return this.run(query)
  }
}

module.exports = new Database(configFile, require('mysql'))