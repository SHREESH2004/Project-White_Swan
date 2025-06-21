'use strict';
import { Model } from 'sequelize';
import { seatType } from '../utils/common/enum.js';

export default (sequelize, DataTypes) => {
  class Seat extends Model {
    static associate(models) {
      this.belongsTo(models.AirPlane, {
        foreignKey: 'airplaneId',
        onDelete: 'CASCADE',
        as: 'Flight Details'
      });
    }
  }

  Seat.init({
    row: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    column: {
      type: DataTypes.STRING,
      allowNull: false
    },
    airplaneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seatType: {
      type: DataTypes.ENUM,
      values: [
        seatType.Business,
        seatType.First_class,
        seatType.Economy,
        seatType.Premium_Economy
      ],
      defaultValue: seatType.Economy,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Seat'
  });

  return Seat;
};
