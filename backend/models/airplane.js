'use strict';

import { Model } from 'sequelize';

/**
 * Defines the AirPlane model.
 * @param {import('sequelize').Sequelize} sequelize 
 * @param {import('sequelize').DataTypes} DataTypes 
 * @returns {typeof Model}
 */
export default (sequelize, DataTypes) => {
  class AirPlane extends Model {
    /**
     * Associate models.
     * @param {object} models 
     */
    static associate(models) {
      // An AirPlane has many Flights
      this.hasMany(models.Flight, {
        foreignKey: 'airplaneId',
        onDelete: 'CASCADE',
      });
    }
  }

  // Define model attributes
  AirPlane.init(
    {
      ModelNo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure model number is unique
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 1000,
        },
      },
    },
    {
      sequelize,
      modelName: 'AirPlane',
      tableName: 'AirPlanes', // Ensure this matches your DB schema
      timestamps: true, // createdAt & updatedAt
    }
  );

  return AirPlane;
};
