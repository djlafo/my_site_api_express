'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Roles', 'createdAt', Sequelize.DATE),
      queryInterface.addColumn('Roles', 'updatedAt', Sequelize.DATE),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Roles', 'createdAt'),
      queryInterface.removeColumn('Roles', 'updatedAt'),
    ]);
  }
};
