'use strict';

import { Model, DataTypes } from 'sequelize';
import { BookingStatus } from '../utils/common/enum.js'; // Ensure this path is valid

export default (sequelize) => {
  class Booking extends Model {
    static associate(models) {
      // Define model relationships
      // Booking.belongsTo(models.User, { foreignKey: 'userid' });
      // Booking.belongsTo(models.Flight, { foreignKey: 'flightid' });
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
      timestamps: true, // automatically adds createdAt & updatedAt
    }
  );

  return Booking;
};
