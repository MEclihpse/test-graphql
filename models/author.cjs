'use strict';
const bcrypt = require('bcryptjs');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Author.hasMany(models.Movie)
    }
  }
  Author.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Author',
  });

  Author.beforeCreate((value) => {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(value.password, salt);
    value.password = hash
  })
  return Author;
};