'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('AirPlanes', [{
      ModelNo: 'Boeing337',
      capacity:900
    }], {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('AirPlanes', {
    ModelNo: {
      [Sequelize.Op.eq]: 'Boeing327'
    }
  }, {});
}
