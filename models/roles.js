const db = require('../db');

const Roles = db.sequelize.define('Roles', {
    id: { type: db.Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
    name: { type: db.Sequelize.TEXT, allowNull: false }
}, {});

module.exports = Roles;