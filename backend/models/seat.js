'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Seat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.AirPlane, {
        foreignKey: 'airplaneId',
        onDelete: 'CASCADE',
        as: 'Flight Details'
      });
      // define association here
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
      values: [Business, First_class, Economy, Premium_Economy],
      defaultValue: Economy,
      allowNull: false,

    },
    sequelize,
    modelName: 'Seat',
  });
  return Seat;
};