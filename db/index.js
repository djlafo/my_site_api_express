const config = require('../config');
const inProd = process.env.NODE_ENV === 'production';
const dbConfig = inProd ? config.production : config.development;

const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'postgres',
    logging: inProd
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
};