// db/seeders/20240905-create-review-images.js
'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';

    const reviews = await Review.findAll();

    await queryInterface.bulkInsert(options, [
      {
        reviewId: reviews[0].id,
        url: 'https://example.com/review1-image1.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        reviewId: reviews[1].id,
        url: 'https://example.com/review2-image1.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    await queryInterface.bulkDelete(options, null, {});
  }
};
