/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Airports', {
      fields: ['cityId'],
      type: 'foreign key',
      name: 'fk_airports_cityId', // Optional: helps with constraint management
      references: {
        table: 'Cities', // Adjust to match your actual table name
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Airports', 'fk_airports_cityId');
  }
};
