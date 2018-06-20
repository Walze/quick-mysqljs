```javascript
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
```