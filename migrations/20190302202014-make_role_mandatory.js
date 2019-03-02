'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};
