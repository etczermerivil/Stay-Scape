const express = require('express');
const { Spot, SpotImage, Review, sequelize } = require('../../db/models');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');

// Create a Spot
