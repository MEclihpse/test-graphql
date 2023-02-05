'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movie.belongsTo(models.Author)
      Movie.hasMany(models.Actor)
    }
  }
  Movie.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: `title is Required`
        },
        notNull: {
          msg: `title is Required`
        }
      }
    },
    slug: {
      type: DataTypes.STRING,
    },
    synopsis: DataTypes.STRING,
    trailerUrl: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    AuthorId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Movie',
  });
  Movie.beforeCreate((value) => {
    value.slug = value.title.replaceAll(' ', '-')
  })

  return Movie;
};