require('dotenv').config(); 

const { Pool } = require('pg');

/**
 * Creates a new PostgreSQL connection pool using environment variables.
 * The Pool instance will manage multiple client connections and distribute them for efficient database operations.
 */
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

module.exports = pool;
