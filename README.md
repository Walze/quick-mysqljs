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

// db.run(query: string): Promise
// db.all(table: string): Promise
// db.id(table: string, id: string): Promise
// db.find(table: string, where: object): Promise
// db.insert(table: string, set: object): Promise
// db.update(table: string, set: object, where: object): Promise
// db.delete(table: string, where: object): Promise
```