const pg = require('pg');

const config = {
  connectionString: process.env.DATABASE_URL,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000,
    ssl: {
    rejectUnauthorized: false
  }
};

const pool = new pg.Pool(config);

pool.on('connect', () => {
  console.log('connected to the Database');
});

/**
 * Create Tables
 */
const createTables = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      users(
        id INTEGER PRIMARY KEY,
        first_name VARCHAR(15) NOT NULL,
        last_name VARCHAR(128) NOT NULL,
        avatar VARCHAR(128) NOT NULL,
        created_at TIMESTAMP
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/**
 * Drop Tables
 */
const dropTables = () => {
  const queryText = 'DROP TABLE IF EXISTS users';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

module.exports = {
  createTables,
  dropTables
};

require('make-runnable');

module.exports = pool;
