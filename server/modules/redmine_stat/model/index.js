const sequelize = require('../../../core/db_conn');
const Sequelize = require('sequelize');

const Statistic = sequelize.define('issue_statistic', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    stat_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    issue_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    project: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    tracker: {
      type: Sequelize.STRING,
      allowNull: false,
      },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      },
    priority: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    assigned_to: {
        type: Sequelize.STRING
      },
  }, {
    // options
  });
  
  module.exports = Statistic;