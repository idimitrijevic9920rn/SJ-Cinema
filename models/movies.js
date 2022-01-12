"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Movies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Screenings }) {
      this.hasMany(Screenings, {
        foreignKey: "movieId",
        as: "screening",
        onDelete: "cascade",
        hooks: true,
      });
    }
  }
  Movies.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      actors: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      producer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timeDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      releaseYear: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Movies",
    }
  );
  return Movies;
};
