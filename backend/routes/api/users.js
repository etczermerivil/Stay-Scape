const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation')
const { User } = require('../../db/models');

const router = express.Router();

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;

    try {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ firstName, lastName, email, username, hashedPassword });

      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }

    catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        const errors = {}
        error.errors.forEach((err) => {
          errors[err.path] = `User with that ${err.path} already exists`
        })

        return res.status(500).json({
          message: 'User already exists',
          errors
        })
      }

      else if (error.name === 'SequelizeValidationError') {
        const errors = {}
        error.errors.forEach((err) => {
          errors[err.path] = err.message
        })

        return res.status(400).json({
          message: 'Bad Request',
          errors
        })
      }

      next(error)
    }
  }
);

module.exports = router;
