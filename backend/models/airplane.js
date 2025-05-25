'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AirPlane extends Model {
    static associate(models) {
      // define association here
    }
  }

  AirPlane.init({
    ModelNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true  // Add uniqueness constraint
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 1000
      }
    }
  }, {
    sequelize,
    modelName: 'AirPlane',
    tableName: 'AirPlanes', // Explicit table name to match your migration
    timestamps: true
  });

  return AirPlane;
};
