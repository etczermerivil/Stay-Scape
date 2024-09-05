// db/seeders/20240905-create-reviews.js
'use strict';

const { User, Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'Reviews';

    const users = await User.findAll();
    const spots = await Spot.findAll();

    await queryInterface.bulkInsert(options, [
      {
        userId: users[0].id,
        spotId: spots[0].id,
        review: 'Amazing spot, had a great time!',
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: users[1].id,
        spotId: spots[1].id,
        review: 'Not bad, could be better.',
        stars: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    await queryInterface.bulkDelete(options, null, {});
  }
};
