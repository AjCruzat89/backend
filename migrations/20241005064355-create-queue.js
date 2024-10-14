'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Queues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      window: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'Windows',
          key: 'window'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      queue_number: {
        type: Sequelize.STRING,
      },
      process: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending'
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
    await queryInterface.dropTable('Queues');
  }
};