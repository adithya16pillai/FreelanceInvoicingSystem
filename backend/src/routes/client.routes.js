const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Client = require('../models/Client');
const auth = require('../middleware/auth');

// Get all clients for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const clients = await Client.find({ user: req.user._id });
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single client
router.get('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new client
router.post('/',
  auth,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        name,
        email,
        company,
        address,
        phone,
        notes,
        currency,
        status
      } = req.body;

      const client = new Client({
        user: req.user._id,
        name,
        email,
        company,
        address,
        phone,
        notes,
        currency,
        status
      });

      await client.save();
      res.status(201).json(client);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update a client
router.put('/:id',
  auth,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        name,
        email,
        company,
        address,
        phone,
        notes,
        currency,
        status
      } = req.body;

      const client = await Client.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        {
          name,
          email,
          company,
          address,
          phone,
          notes,
          currency,
          status
        },
        { new: true }
      );

      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }

      res.json(client);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete a client
router.delete('/:id', auth, async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 