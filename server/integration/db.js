
const { Pool } = require('pg');


const pool = new Pool({
    user: 'myPostgres',
    host: 'localhost',
    database: 'myPostgres',
    password: '', 
    port: 5432,
  });
  

module.exports = pool;
