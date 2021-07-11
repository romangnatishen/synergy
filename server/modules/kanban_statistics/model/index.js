const sequelize = require('../../../core/db_conn');
const Sequelize = require('sequelize');

const KanbanStatistics = sequelize.define('kanban_statistic', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    stat_date: {
        type: Sequelize.DATE,
        // allowNull: false,
      },
    project_id: {
        type: Sequelize.INTEGER
      },
    project_name: {
        type: Sequelize.STRING
      },
    kanban_status_id: {
        type: Sequelize.INTEGER
      },
    executor_id: {
        type: Sequelize.INTEGER
      },
    executor_name: {
        type: Sequelize.STRING
      },
    issue_id: {
        type: Sequelize.INTEGER
      },
    issue_name: {
        type: Sequelize.STRING
      },
    important_issue: {
        type: Sequelize.INTEGER
      },      
    executed_issue: {
        type: Sequelize.INTEGER
      },      
  }, {
    // options
  });
  
  module.exports = KanbanStatistics;