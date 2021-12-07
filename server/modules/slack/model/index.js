const sequelize = require('../../../core/db_conn');
const Sequelize = require('sequelize');

const Lead = sequelize.define('lead', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    company: {
      type: Sequelize.STRING,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    telephone: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    comment: {
      type: Sequelize.STRING,
    },   
  }, {
    // options
  });
  
  module.exports = Lead;