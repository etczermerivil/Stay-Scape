const express = require('express');
const router = require('express').Router({ mergeParams: true }); // Allows access to :spotId
const { requireAuth } = require('../../utils/auth');
const { Booking, Spot, User } = require('../../db/models');
const { Op } = require('sequelize'); // Import Op for Sequelize operations

// Get all bookings of the current user (authentication required)
// Get all bookings for the current user
router.get('/current', requireAuth, async (req, res) => {
  const bookings = await Booking.findAll({
    where: { userId: req.user.id },  // Fetch bookings by userId
  });
  res.json({ Bookings: bookings });
});

// Get all bookings for a specific spot
router.get('/', requireAuth, async (req, res) => {
  const { spotId } = req.params;

  // Check if the spot exists
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    console.log('Spot not found for spotId:', spotId);
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  console.log('Spot found:', spot);

  // Fetch bookings by spotId
  const bookings = await Booking.findAll({
    where: { spotId },  // Fetch by spotId
    attributes: ['spotId', 'startDate', 'endDate']
  });

  console.log('Bookings found for spotId:', spotId, bookings);

  // Return the bookings
  return res.status(200).json({ Bookings: bookings });
});

router.post('/', requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { startDate, endDate } = req.body;

  // Convert to Date objects for validation
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  // Validate the spot exists
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  // Ensure the spot does not belong to the current user
  if (spot.ownerId === req.user.id) {
    return res.status(403).json({ message: 'Forbidden: You cannot book your own spot' });
  }

  // Check if startDate is in the past
  if (start < today) {
    return res.status(400).json({
      message: 'Bad Request',
      errors: {
        startDate: 'Start date cannot be in the past',
      },
    });
  }

  // Check if endDate is before startDate
  if (end <= start) {
    return res.status(400).json({
      message: 'Bad Request',
      errors: {
        endDate: 'End date cannot be on or before start date',
      },
    });
  }

  // Check for date conflicts with existing bookings
  const conflictingBookings = await Booking.findAll({
    where: {
      spotId,
      [Op.or]: [
        {
          startDate: {
            [Op.between]: [startDate, endDate], // StartDate falls within an existing booking
          },
        },
        {
          endDate: {
            [Op.between]: [startDate, endDate], // EndDate falls within an existing booking
          },
        },
        {
          [Op.and]: [
            {
              startDate: {
                [Op.lte]: startDate, // Existing booking starts before or on the same day as the requested startDate
              },
            },
            {
              endDate: {
                [Op.gte]: endDate, // Existing booking ends after or on the same day as the requested endDate
              },
            },
          ],
        },
      ],
    },
  });

  if (conflictingBookings.length > 0) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }

  // Create the booking
  const newBooking = await Booking.create({
    userId: req.user.id,
    spotId,
    startDate,
    endDate,
  });

  return res.status(201).json(newBooking);
});


// Edit a booking (authentication required)
router.put('/:bookingId', requireAuth, async (req, res) => {
  const { bookingId } = req.params;
  const { startDate, endDate } = req.body;

  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  // Ensure the booking belongs to the current user
  if (booking.userId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden: You can only edit your own bookings' });
  }

  // Ensure the booking is not in the past
  const currentDate = new Date();
  if (new Date(booking.endDate) < currentDate) {
    return res.status(403).json({ message: "Past bookings can't be modified" });
  }

  // Check for date conflicts
  const conflictingBookings = await Booking.findAll({
    where: {
      spotId: booking.spotId,
      id: { [Op.ne]: booking.id }, // Ensure the conflict check excludes the current booking
      [Op.or]: [
        {
          startDate: {
            [Op.lte]: endDate,
          },
          endDate: {
            [Op.gte]: startDate,
          },
        },
      ],
    },
  });

  if (conflictingBookings.length > 0) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }

  await booking.update({ startDate, endDate });
  return res.json(booking);
});

// Delete a booking (authentication required)
router.delete('/:bookingId', requireAuth, async (req, res) => {
  const { bookingId } = req.params;

  const booking = await Booking.findByPk(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking couldn't be found" });
  }

  // Ensure the booking belongs to the current user or the spot belongs to the current user
  const spot = await Spot.findByPk(booking.spotId);
  if (booking.userId !== req.user.id && spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden: You can only delete your own bookings or bookings for your spots' });
  }

  // Ensure the booking has not started yet
  const currentDate = new Date();
  if (new Date(booking.startDate) <= currentDate) {
    return res.status(403).json({ message: "Bookings that have started can't be deleted" });
  }

  await booking.destroy();
  return res.json({ message: 'Successfully deleted' });
});

module.exports = router;
