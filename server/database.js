const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "raghavan@06",
    host: "localhost",
    port: "5432",
    database: "foodkart"
});

module.exports = pool;