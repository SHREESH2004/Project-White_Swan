'use strict';

import { Model, DataTypes } from 'sequelize';
import { BookingStatus, seatType } from '../utils/common/enum.js'; // Make sure paths are correct

export default (sequelize) => {
  class Booking extends Model {
    static associate(models) {
    }
  }

  Booking.init(
    {
      flightid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          BookingStatus.BOOKED,
          BookingStatus.CANCELLED,
          BookingStatus.INITIATED,
          BookingStatus.PENDING
        ),
        allowNull: false,
        defaultValue: BookingStatus.INITIATED,
      },
      seatType: {
        type: DataTypes.ENUM(
          seatType.Business,
          seatType.First_class,
          seatType.Economy,
          seatType.Premium_Economy
        ),
        allowNull: false,
        defaultValue: seatType.Economy,
      },
      noOfSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1,
        },
      },
      totalCost: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
        },
      },
    },
    {
      sequelize,
      modelName: 'Booking',
      tableName: 'Bookings',
      timestamps: true,
    }
  );

  return Booking;
};
