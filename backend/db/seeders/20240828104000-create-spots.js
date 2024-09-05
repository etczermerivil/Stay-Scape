// db/seeders/20240905-create-spots.js
'use strict';

const { User } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Spots';

    const users = await User.findAll();
    const ownerId = users[0].id; // Assuming the first user is the owner

    await queryInterface.bulkInsert(options, [
      {
        ownerId,
        address: '123 Disney Lane',
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'App Academy',
        description: 'Place where web developers are created',
        price: 123,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        ownerId,
        address: '456 Main Street',
        city: 'Los Angeles',
        state: 'California',
        country: 'United States of America',
        lat: 34.052235,
        lng: -118.243683,
        name: 'Coding Hub',
        description: 'Where coding enthusiasts gather',
        price: 200,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    await queryInterface.bulkDelete(options, null, {});
  }
};
