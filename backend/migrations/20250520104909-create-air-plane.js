'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('AirPlanes', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    ModelNo: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    capacity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });

  // Add CHECK constraint for capacity (0 <= capacity <= 1000)
  await queryInterface.addConstraint('AirPlanes', {
    fields: ['capacity'],
    type: 'check',
    name: 'check_capacity_range',
    where: {
      capacity: {
        [Sequelize.Op.gte]: 0,
        [Sequelize.Op.lte]: 1000
      }
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('AirPlanes');
}
