'use strict';

import { BookingStatus, seatType } from "../utils/common/enum.js";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      flightid: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      userid: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM(
          BookingStatus.BOOKED,
          BookingStatus.CANCELLED,
          BookingStatus.INITIATED,
          BookingStatus.PENDING
        ),
        allowNull: false,
        defaultValue: BookingStatus.INITIATED,
      },
      seatType: {
        type: Sequelize.ENUM(
          seatType.Business,
          seatType.First_class,
          seatType.Economy,
          seatType.Premium_Economy
        ),
        allowNull: false,
        defaultValue: seatType.Economy,
      },
      noOfSeats: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      totalCost: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable('Bookings');
  }

};
