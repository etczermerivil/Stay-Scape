const express = require('express');
const router = express.Router({ mergeParams: true });
const { requireAuth } = require('../../utils/auth');
const { Review, Spot, ReviewImage, User } = require('../../db/models');

const reviewImagesRouter = require('./review-images');
router.use('/:reviewId/images', reviewImagesRouter);


router.get('/current', requireAuth, async (req, res) => {
  const reviews = await Review.findAll({
    where: { userId: req.user.id },
    include: [
      {
        model: Spot,
        attributes: [
          'id', 'ownerId', 'address', 'city', 'state', 'country',
          'lat', 'lng', 'name', 'price', // Include necessary spot details
          [sequelize.literal('(SELECT url FROM "SpotImages" WHERE "SpotImages"."spotId" = "Spot"."id" AND "SpotImages"."preview" = true LIMIT 1)'), 'previewImage'] // Add preview image dynamically
        ]
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url'] // Include review images
      },
      {
        model: User, // Include user details for the review
        attributes: ['id', 'firstName', 'lastName']
      }
    ],
    attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'] // Ensure createdAt and updatedAt are included
  });

  return res.status(200).json({ Reviews: reviews });
});


// Get all reviews for a specific spot by spotId (no authentication required)
router.get('/', async (req, res) => {
  const { spotId } = req.params;

  // Find the spot to make sure it exists
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  // Get reviews for the spot
  const reviews = await Review.findAll({
    where: { spotId },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']  // Include user details
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']  // Include review images
      }
    ],
    attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'] // Include createdAt and updatedAt
  });

  return res.status(200).json({ Reviews: reviews });
});

// Create a new review for a spot by spotId (authentication required)
router.post('/:spotId', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { review, stars } = req.body;

  // Check if the spot exists
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  // Check if the user already has a review for this spot
  const existingReview = await Review.findOne({
    where: {
      userId: req.user.id,
      spotId
    }
  });

  if (existingReview) {
    return res.status(403).json({
      message: "User already has a review for this spot"
    });
  }

  // Validate input
  let errors = {};
  if (!review) errors.review = 'Review text is required';
  if (!stars || stars < 1 || stars > 5) errors.stars = 'Stars must be an integer from 1 to 5';

  // If there are validation errors, return a 400 status with the error details
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation Error',
      errors
    });
  }

  // Create the review
  const newReview = await Review.create({
    userId: req.user.id,
    spotId,
    review,
    stars,
  });

  return res.status(201).json({
    id: newReview.id,
    userId: newReview.userId,
    spotId: newReview.spotId,
    review: newReview.review,
    stars: newReview.stars,
    createdAt: newReview.createdAt,
    updatedAt: newReview.updatedAt
  });
});




router.put('/:reviewId', requireAuth, async (req, res) => {
  const { reviewId } = req.params;
  const { review, stars } = req.body;

  // Check if the review exists
  const existingReview = await Review.findByPk(reviewId);
  if (!existingReview) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }

  // Ensure the current user owns the review
  if (existingReview.userId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden: You do not own this review' });
  }

  // Validate input
  let errors = {};
  if (!review) errors.review = 'Review text is required';
  if (!stars || stars < 1 || stars > 5) errors.stars = 'Stars must be an integer from 1 to 5';

  // If there are validation errors, return a 400 status with the error details
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation Error',
      errors
    });
  }

  // Update the review
  await existingReview.update({
    review,
    stars
  });

  // Return the updated review with createdAt and updatedAt
  return res.status(200).json({
    id: existingReview.id,
    userId: existingReview.userId,
    spotId: existingReview.spotId,
    review: existingReview.review,
    stars: existingReview.stars,
    createdAt: existingReview.createdAt,
    updatedAt: existingReview.updatedAt
  });
});





// Delete a review (authentication required)
router.delete('/:reviewId', requireAuth, async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findByPk(reviewId);
  if (!review) {
    return res.status(404).json({ message: "Review couldn't be found" });
  }

  // Ensure the review belongs to the current user
  if (review.userId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await review.destroy();
  return res.json({ message: 'Successfully deleted' });
});

module.exports = router;
