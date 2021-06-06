const Pool = require("pg").Pool;

// Local DB
// const pool = new Pool({
//   user: "postgres",
//   password: "password",
//   host: "localhost",
//   // host: "dfitdb", // For Docker container supposedly?
//   port: 5432,
//   database: "dfitdb"
// });

// Connecting to ElephantSQL
const pool = new Pool({
  user: "jabhvknj",
  password: "EVxab_RfhOwMlZF3noSWFVo47fIL8tqq",
  host: "kashin.db.elephantsql.com",
  port: 5432,
  database: "jabhvknj"
});

module.exports = pool;

// ALTER ROLE jabhvknj CONNECTION LIMIT - 1;

// Docker attempt
// postgres://user:password@wallnerdatabase:5432/dbname
// postgres://psql:password@dfitdb:5432/dfitdb // Sequelize apparently
