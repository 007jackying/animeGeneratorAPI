const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "anesthesia",
    database: "dbAnime",
    host: "192.168.2.100",
    port: 9005
});

module.exports = pool;