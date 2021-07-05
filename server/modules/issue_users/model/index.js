const sequelize = require('../../../core/db_conn');
const Sequelize = require('sequelize');

const Participants = sequelize.define('issue_user', {
    // attributes
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    issue_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    issue_closed: {
        type: Sequelize.BOOLEAN
      },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    user_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
    user_type: {
      type: Sequelize.INTEGER,
      allowNull: false
      }
  }, {
    // options
  });
  
  module.exports = Participants;