const express = require('express');
const { Spot, SpotImage, Review, sequelize } = require('../../db/models');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');

// GET all spots
router.get('/', async (req, res) => {
  try {
    const spots = await Spot.findAll({
      include: [
        {
          model: SpotImage,
          attributes: ['url', 'preview'],
          where: { preview: true },
          required: false,
        },
        {
          model: Review,
          attributes: [],
        }
      ],
      attributes: {
        include: [
          [
            sequelize.fn('AVG', sequelize.col('Reviews.stars')),
            'avgRating'
          ],
          'createdAt',
          'updatedAt'
        ]
      },
      group: ['Spot.id', 'SpotImages.id'],
    });

    return res.status(200).json({
      Spots: spots.map(spot => ({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: spot.dataValues.avgRating || null,
        previewImage: spot.SpotImages.length ? spot.SpotImages[0].url : null,
      }))
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'An error occurred while fetching spots.',
    });
  }
});

module.exports = router;
