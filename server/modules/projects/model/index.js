const sequelize = require('../../../core/db_conn');
const Sequelize = require('sequelize');

const Project = sequelize.define('project', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    redmine_id: {
        type: Sequelize.INTEGER
      },
    hubstaff_id: {
        type: Sequelize.INTEGER
      },      
    bg_monitoring: {
        type: Sequelize.BOOLEAN
      },      

  }, {
    // options
  });
  
  module.exports = Project;