const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "password",
  host: "localhost",
  // host: "dfitdb", // For Docker container supposedly?
  port: 5432,
  database: "dfitdb"
});

module.exports = pool;

// Docker attempt
// postgres://user:password@wallnerdatabase:5432/dbname
// postgres://psql:password@dfitdb:5432/dfitdb // Sequelize apparently
