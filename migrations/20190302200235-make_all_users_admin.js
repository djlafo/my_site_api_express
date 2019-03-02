'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('update "Users" set role = (select id from "Roles" where name = \'Admin\')');
  },

  down: (queryInterface, Sequelize) => {
  }
};
