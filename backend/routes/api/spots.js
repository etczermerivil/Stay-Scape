const express = require('express');
const { Spot, SpotImage, Review, sequelize, User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

const bookingsRouter = require('./bookings');
router.use('/:spotId/bookings', bookingsRouter);

const reviewsRouter = require('./reviews');
router.use('/:spotId/reviews', reviewsRouter);

// GET all spots (no authentication required)
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
          [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating'],
        ]
      },
      group: ['Spot.id', 'SpotImages.id'],
    });

    const spotsList = spots.map(spot => ({
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
    }));

    return res.status(200).json({ Spots: spotsList });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'An error occurred while fetching spots.',
    });
  }
});

// GET all spots owned by the current user (authentication required)
router.get('/current', requireAuth, async (req, res) => {
  try {
    const spots = await Spot.findAll({
      where: { ownerId: req.user.id },
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
          [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating'],
        ]
      },
      group: ['Spot.id', 'SpotImages.id'],
    });

    const spotsList = spots.map(spot => ({
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
    }));

    return res.status(200).json({ Spots: spotsList });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'An error occurred while fetching user spots.',
    });
  }
});

// GET details of a spot by its id (no authentication required)
router.get('/:spotId', async (req, res) => {
  const { spotId } = req.params;

  if (!spotId || isNaN(spotId)) {
    return res.status(400).json({
      message: "Invalid spotId. It must be a valid integer."
    });
  }

  const spot = await Spot.findByPk(spotId, {
    include: [
      {
        model: SpotImage,
        attributes: ['id', 'url', 'preview'],
        required: false,
      },
      {
        model: Review,
        attributes: ['stars'],
      },
      {
        model: User,
        as: 'Owner',
        attributes: ['id', 'firstName', 'lastName']
      }
    ],
  });

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  const avgRating = await Review.findOne({
    where: { spotId: spot.id },
    attributes: [[sequelize.fn('AVG', sequelize.col('stars')), 'avgStarRating']],
    raw: true,
  });

  const numReviews = await Review.count({ where: { spotId: spot.id } });

  return res.status(200).json({
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
    numReviews,
    avgStarRating: avgRating.avgStarRating || null,
    SpotImages: spot.SpotImages,
    Owner: {
      id: spot.Owner.id,
      firstName: spot.Owner.firstName,
      lastName: spot.Owner.lastName
    }
  });
});


// POST create a spot (authentication required)
router.post('/', requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  if (!address || !city || !state || !country || !lat || !lng || !name || !description || !price) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: {
        address: 'Street address is required',
        city: 'City is required',
        state: 'State is required',
        country: 'Country is required',
        lat: 'Latitude must be within -90 and 90',
        lng: 'Longitude must be within -180 and 180',
        name: 'Name must be less than 50 characters',
        description: 'Description is required',
        price: 'Price per day must be a positive number',
      }
    });
  }

  const newSpot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  });

  return res.status(201).json({
    id: newSpot.id,
    ownerId: newSpot.ownerId,
    address: newSpot.address,
    city: newSpot.city,
    state: newSpot.state,
    country: newSpot.country,
    lat: newSpot.lat,
    lng: newSpot.lng,
    name: newSpot.name,
    description: newSpot.description,
    price: newSpot.price,
    createdAt: newSpot.createdAt,
    updatedAt: newSpot.updatedAt
  });
});

// POST add an image to a spot (authentication and authorization required)
router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;

  // Check if the spot exists
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  // Check if the current user owns the spot
  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Create the new image
  const newImage = await SpotImage.create({
    spotId,
    url,
    preview,
  });

  return res.status(201).json({
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview,
  });
});

// PUT edit a spot (authentication and authorization required)
router.put('/:spotId', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  // Check if the current user owns the spot
  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  // Validate input
  if (!address || !city || !state || !country || !lat || !lng || !name || !description || !price) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: {
        address: 'Street address is required',
        city: 'City is required',
        state: 'State is required',
        country: 'Country is required',
        lat: 'Latitude must be within -90 and 90',
        lng: 'Longitude must be within -180 and 180',
        name: 'Name must be less than 50 characters',
        description: 'Description is required',
        price: 'Price per day must be a positive number',
      }
    });
  }

  await spot.update({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price
  });

  return res.json(spot);
});


// DELETE a spot (authentication and authorization required)
router.delete('/:spotId', requireAuth, async (req, res) => {
  const { spotId } = req.params;

  // Find the spot
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  // Check if the current user owns the spot
  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden: You do not own this spot' });
  }

  try {
    // Delete all related SpotImages
    await SpotImage.destroy({ where: { spotId } });

    // Delete all related Reviews
    await Review.destroy({ where: { spotId } });

    // Delete all related Bookings
    await Booking.destroy({ where: { spotId } });

    // Now, delete the spot itself
    await spot.destroy();

    return res.status(200).json({ message: 'Successfully deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
});



module.exports = router;
