Helper methods for mysqljs

```typescript
// Example
const Database = require('./DB')

const db = new Database({
    username:  '',
    password:  '',
    database:  '',
    host:  '',
    port:  '3306'
});
const result = db.run('SELECT 2 * 2 as result')

result.then(console.log).catch(console.log)

// db.run(query: string)
// db.all(table: string)
// db.id(table: string, id: string)
// db.find(table: string, where: object)
// db.insert(table: string, set: object)
// db.update(table: string, set: object, where: object)
// db.delete(table: string, where: object)
```