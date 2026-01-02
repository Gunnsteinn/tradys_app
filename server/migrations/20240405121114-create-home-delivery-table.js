"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("pick_up_rate", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      from: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      package: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      package_plus2: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      package_plus5: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      pallet: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("pick_up_rate");
  },
};
