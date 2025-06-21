'use strict';

import { seatType } from '../utils/common/enum.js';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Seats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      row: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      column: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      airplaneId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'AirPlanes',
          key: 'id',
        },
      },
      seatType: {
        type: Sequelize.ENUM,
        values: [
          seatType.Business,
          seatType.First_class,
          seatType.Economy,
          seatType.Premium_Economy
        ],
        defaultValue: seatType.Economy,
        allowNull: false,
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
    await queryInterface.dropTable('Seats');
  }
};
