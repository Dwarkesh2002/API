const { Pool } = require('pg');

// Create a pool of connections to the database
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'menu',
  password: '123',
  port: 5432,
});

// Export the pool for use in your routes or controllers
module.exports = pool;
