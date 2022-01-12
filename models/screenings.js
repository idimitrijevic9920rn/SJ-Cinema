"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Screenings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Movies }) {
      this.belongsTo(Movies, { foreignKey: "movieId", as: "movie" });
    }
  }
  Screenings.init(
    {
      date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      day: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      movieId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      movieName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Screenings",
    }
  );
  return Screenings;
};
