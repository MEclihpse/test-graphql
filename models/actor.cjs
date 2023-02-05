'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Actor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Actor.belongsTo(models.Movie)
    }
  }
  Actor.init({
    MovieId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    profilePict: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Actor',
  });
  return Actor;
};