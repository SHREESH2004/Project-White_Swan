'use strict';

import { seatType } from '../utils/common/enum.js';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('Seats', [
    // Row 1
    {
      row: 1,
      column: 'A',
      airplaneId: 1,
      seatType: seatType.Business,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      row: 1,
      column: 'B',
      airplaneId: 1,
      seatType: seatType.First_class,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      row: 1,
      column: 'C',
      airplaneId: 1,
      seatType: seatType.Economy,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      row: 1,
      column: 'D',
      airplaneId: 1,
      seatType: seatType.Premium_Economy,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Row 2
    {
      row: 2,
      column: 'A',
      airplaneId: 1,
      seatType: seatType.Business,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      row: 2,
      column: 'B',
      airplaneId: 1,
      seatType: seatType.First_class,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      row: 2,
      column: 'C',
      airplaneId: 1,
      seatType: seatType.Economy,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      row: 2,
      column: 'D',
      airplaneId: 1,
      seatType: seatType.Premium_Economy,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Seats', {
    airplaneId: 1,
    row: {
      [Sequelize.Op.in]: [1, 2]
    },
    column: {
      [Sequelize.Op.in]: ['A', 'B', 'C', 'D']
    }
  }, {});
}
