
const { Pool } = require('pg');


const pool = new Pool({
    user: 'myPostgres',
    host: 'localhost',
    database: 'myPostgres',
    password: '', // Use the new password you just set
    port: 5432,
  });
  

module.exports = pool;
