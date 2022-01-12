"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("Movies", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable("Movies");
  },
};
