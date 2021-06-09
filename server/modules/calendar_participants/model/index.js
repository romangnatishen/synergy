const sequelize = require('../../../core/db_conn');
const Sequelize = require('sequelize');

const Participants = sequelize.define('participant', {
    // attributes
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    event_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    participant_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    event_owner: {
        type: Sequelize.INTEGER
      }
  }, {
    // options
  });
  
  module.exports = Participants;