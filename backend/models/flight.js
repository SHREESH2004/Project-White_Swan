'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Flight extends Model {
    static associate(models) {
      // A Flight belongs to an AirPlane
      this.belongsTo(models.AirPlane, {
        foreignKey: 'airplaneId',
        onDelete: 'CASCADE',
      });

      // Assuming Airport.code is used (string primary key)
      this.belongsTo(models.Airport, {
        foreignKey: 'departureAirportId',
        targetKey: 'code',
        onDelete: 'CASCADE',
      });

      this.belongsTo(models.Airport, {
        foreignKey: 'arrivalAirportId',
        targetKey: 'code',
        onDelete: 'CASCADE',
      });
    }
  }

  Flight.init(
    {
      flightNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      airplaneId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      departureAirportId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      arrivalAirportId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      arrivalTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      departureTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      boardingGate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      totalSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
        },
      },
    },
    {
      sequelize,
      modelName: 'Flight',
      tableName: 'Flights',
      timestamps: true,
    }
  );

  return Flight;
};
