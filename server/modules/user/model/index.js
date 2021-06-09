const sequelize = require('../../../core/db_conn');
const Sequelize = require('sequelize');

const User = sequelize.define('user', {
    // attributes
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    // role: {
    //     type: Sequelize.INTEGER
    //   },
    user_status: {
        type: Sequelize.INTEGER
      },
    // client_id: {
    //     type: Sequelize.INTEGER
    //   },
    name: {
        type: Sequelize.STRING
      },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate:{
          isEmail: true
        }
      },
    redmine_api_key: {
          type: Sequelize.STRING
          },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      notEmpty: true
    }          

  }, {
    // options
  });

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  }
  
  module.exports = User;