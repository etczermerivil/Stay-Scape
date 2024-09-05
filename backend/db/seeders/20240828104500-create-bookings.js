// db/seeders/20240905-create-bookings.js
'use strict';

const { User, Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Bookings';

    try {
      const users = await User.findAll();
      const spots = await Spot.findAll();

      // Check if users and spots are retrieved correctly
      if (users.length === 0 || spots.length === 0) {
        console.error('No users or spots found in the database. Please ensure that users and spots are seeded before running bookings.');
        return;
      }

      await queryInterface.bulkInsert(options, [
        {
          userId: users[0]?.id,  // Added optional chaining to avoid undefined errors
          spotId: spots[0]?.id,
          startDate: '2024-10-01',
          endDate: '2024-10-07',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          userId: users[1]?.id,
          spotId: spots[1]?.id,
          startDate: '2024-11-01',
          endDate: '2024-11-10',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { validate: true });
    } catch (error) {
      console.error('Error while seeding Bookings:', error);
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    await queryInterface.bulkDelete(options, null, {});
  }
};
