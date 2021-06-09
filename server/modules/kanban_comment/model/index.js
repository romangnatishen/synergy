const sequelize = require('../../../core/db_conn');
const Sequelize = require('sequelize');

const Kanban_comment = sequelize.define('kanban_comment', {
    // attributes
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

      },
    user_name: {
        type: Sequelize.STRING,
        allowNull: false,

      },
    issue_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  }, {
    // options
  });
  
  module.exports = Kanban_comment;