'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '123 Demo St',
        city: 'Demo City',
        state: 'DC',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Demo Spot 1',
        description: 'A lovely demo spot for testing.',
        price: 100.00,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId: 2,
        address: '456 Example Ave',
        city: 'Sample City',
        state: 'SC',
        country: 'USA',
        lat: 40.7128,
        lng: -74.0060,
        name: 'Demo Spot 2',
        description: 'Another great spot for demos.',
        price: 150.00,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Demo Spot 1', 'Demo Spot 2'] }
    }, {});
  }
};
