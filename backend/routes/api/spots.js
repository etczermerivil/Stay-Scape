const express = require('express');
const { Spot, SpotImage, Review, Booking, sequelize, User } = require('../../db/models');
const { requireAuth, requireProperAuthorization } = require('../../utils/auth');
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
      group: ['Spot.id'],
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
      group: ['Spot.id'],
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
        attributes: [],  // Exclude details but allow aggregation
      },
      {
        model: User,
        as: 'Owner',
        attributes: ['id', 'firstName', 'lastName']
      }
    ],
    attributes: {
      include: [
        [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgStarRating'],
        [sequelize.fn('COUNT', sequelize.col('Reviews.id')), 'numReviews']
      ]
    },
    group: ['Spot.id', 'SpotImages.id', 'Owner.id'],  // Grouping by Spot and Owner
  });

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

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
    numReviews: spot.dataValues.numReviews || 0,
    avgStarRating: spot.dataValues.avgStarRating || null,
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

  try {
    // Find the spot by ID
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Ensure the current user owns the spot
    if (spot.ownerId !== req.user.id) {
      // If the spot doesn't belong to the user, we don't need to explicitly return a 403,
      // but we also shouldn't delete the spot. We simply return 404 as if it doesn't exist.
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Delete related SpotImages
    await SpotImage.destroy({ where: { spotId } });

    // Delete related Reviews
    await Review.destroy({ where: { spotId } });

    // Delete related Bookings
    await Booking.destroy({ where: { spotId } });

    // Now, delete the spot itself
    await spot.destroy();

    return res.status(200).json({ message: 'Successfully deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    // Extract query parameters
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    // Validate query parameters
    page = parseInt(page) || 1;
    size = parseInt(size) || 20;

    // Validate page
    if (isNaN(page) || page < 1) {
      return res.status(400).json({
        message: "Bad Request",
        errors: { page: "Page must be greater than or equal to 1" }
      });
    }

    // Validate size
    if (isNaN(size) || size < 1 || size > 20) {
      return res.status(400).json({
        message: "Bad Request",
        errors: { size: "Size must be between 1 and 20" }
      });
    }

    // Validate latitude
    if (minLat && (isNaN(minLat) || minLat < -90 || minLat > 90)) {
      return res.status(400).json({
        message: "Bad Request",
        errors: { minLat: "Minimum latitude is invalid" }
      });
    }
    if (maxLat && (isNaN(maxLat) || maxLat < -90 || maxLat > 90)) {
      return res.status(400).json({
        message: "Bad Request",
        errors: { maxLat: "Maximum latitude is invalid" }
      });
    }

    // Validate longitude
    if (minLng && (isNaN(minLng) || minLng < -180 || minLng > 180)) {
      return res.status(400).json({
        message: "Bad Request",
        errors: { minLng: "Minimum longitude is invalid" }
      });
    }
    if (maxLng && (isNaN(maxLng) || maxLng < -180 || maxLng > 180)) {
      return res.status(400).json({
        message: "Bad Request",
        errors: { maxLng: "Maximum longitude is invalid" }
      });
    }

    // Validate price
    if (minPrice && (isNaN(minPrice) || minPrice < 0)) {
      return res.status(400).json({
        message: "Bad Request",
        errors: { minPrice: "Minimum price must be greater than or equal to 0" }
      });
    }
    if (maxPrice && (isNaN(maxPrice) || maxPrice < 0)) {
      return res.status(400).json({
        message: "Bad Request",
        errors: { maxPrice: "Maximum price must be greater than or equal to 0" }
      });
    }

    const where = {};

    // Add latitude filters
    if (minLat) where.lat = { [sequelize.Op.gte]: parseFloat(minLat) };
    if (maxLat) where.lat = { ...where.lat, [sequelize.Op.lte]: parseFloat(maxLat) };

    // Add longitude filters
    if (minLng) where.lng = { [sequelize.Op.gte]: parseFloat(minLng) };
    if (maxLng) where.lng = { ...where.lng, [sequelize.Op.lte]: parseFloat(maxLng) };

    // Add price filters
    if (minPrice && minPrice >= 0) where.price = { [sequelize.Op.gte]: parseFloat(minPrice) };
    if (maxPrice && maxPrice >= 0) where.price = { ...where.price, [sequelize.Op.lte]: parseFloat(maxPrice) };

    // Find spots to be deleted
    const spotsToDelete = await Spot.findAll({
      where,
      limit: size,
      offset: (page - 1) * size,
    });

    // If no spots found, return a message
    if (!spotsToDelete.length) {
      return res.status(404).json({ message: 'No spots found to delete' });
    }

    // Delete the spots and related records (if applicable)
    await Spot.destroy({ where });

    return res.status(200).json({
      message: 'Spots successfully deleted',
      Spots: spotsToDelete.map(spot => ({
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
      })),
      page,
      size
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Server Error',
      error: err.message,
    });
  }
});




module.exports = router;
