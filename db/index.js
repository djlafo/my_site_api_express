const config = require('../config');
const dbConfig = process.env.NODE_ENV === 'production' ? config.production : config.development;

const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'postgres'
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
};