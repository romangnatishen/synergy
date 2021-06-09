const Sequelize = require('sequelize');

// const sequelize = new Sequelize(process.env.DB_URL, {dialect: process.env.DB_DIALECT});

const {
  db_name,
  db_user,
  db_password,
  db_dialect,
  db_host,
  db_port
} = require('./core.config');

const operatorsAliases = require('./operators_aliases');

const sequelize = new Sequelize(db_name, db_user, db_password, {
  dialect: db_dialect,
  host: db_host,
  port: db_port,
  operatorsAliases,
  logging: false // process.env.NODE_ENV === 'development' ? true : false,
});

module.exports = sequelize;