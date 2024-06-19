const Config = require('./config');

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: Config.DB_HOST,
        port: Config.DB_PORT || 3306,
        database: Config.DB_NAME,
        user: Config.DB_USER,
        password: Config.DB_PASSWORD,
    }
});

module.exports = knex;