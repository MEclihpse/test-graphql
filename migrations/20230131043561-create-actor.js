'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Actors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      MovieId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Movies',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      profilePict: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Actors');
  }
};