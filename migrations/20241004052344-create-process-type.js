'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProcessTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      window: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Windows',
          key: 'window'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      process_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      coding: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProcessTypes');
  }
};