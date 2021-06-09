const sequelize = require('../../../core/db_conn');
const Sequelize = require('sequelize');

const Events = sequelize.define('event', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    tittle: {
        type: Sequelize.STRING,
        allowNull: false
      },
    project_id: {
        type: Sequelize.INTEGER
      },
    description: {
        type: Sequelize.STRING
      },
    start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    start_hours: {
        type: Sequelize.STRING,
        allowNull: false
      },
    start_minutes: {
        type: Sequelize.STRING
      },
    end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    end_hours: {
        type: Sequelize.STRING,
        allowNull: false
      },
    end_minutes: {
        type: Sequelize.STRING
      },
  }, {
    // options
  });
  
  module.exports = Events;