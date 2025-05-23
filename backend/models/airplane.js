'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class AirPlane extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  AirPlane.init({
    ModelNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      defaultValue:0,
    },
  }, {
    sequelize,
    modelName: 'AirPlane',
    timestamps: true
  });

  return AirPlane;
};
