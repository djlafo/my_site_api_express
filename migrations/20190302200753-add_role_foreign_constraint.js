'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('Users', ['role'], {
      type: 'foreign key',
      name: 'role_foreign_constraint',
      references: {
        table: 'Roles',
        field: 'id'
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('Users', 'role_foreign_constraint');
  }
};
