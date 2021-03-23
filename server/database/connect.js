const monk = require('monk');
const db = monk("localhost/LaHacksDB");


module.exports = db;
