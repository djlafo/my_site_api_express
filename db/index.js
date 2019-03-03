const inProd = process.env.NODE_ENV === 'production';

const Sequelize = require('sequelize');
const sequelize = new Sequelize('MyDatabase', 'my_site_user', '12345', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres'
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
};