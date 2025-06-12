const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Get all projects for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id })
      .populate('client', 'name email company');
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('client', 'name email company');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new project
router.post('/',
  auth,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('client').notEmpty().withMessage('Client is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('rate.amount').isNumeric().withMessage('Rate amount must be a number'),
    body('rate.type').isIn(['hourly', 'fixed']).withMessage('Rate type must be hourly or fixed')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        name,
        client,
        description,
        startDate,
        endDate,
        status,
        rate,
        notes
      } = req.body;

      const project = new Project({
        user: req.user._id,
        name,
        client,
        description,
        startDate,
        endDate,
        status,
        rate,
        notes
      });

      await project.save();
      res.status(201).json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update a project
router.put('/:id',
  auth,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('client').notEmpty().withMessage('Client is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('rate.amount').isNumeric().withMessage('Rate amount must be a number'),
    body('rate.type').isIn(['hourly', 'fixed']).withMessage('Rate type must be hourly or fixed')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        name,
        client,
        description,
        startDate,
        endDate,
        status,
        rate,
        notes
      } = req.body;

      const project = await Project.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        {
          name,
          client,
          description,
          startDate,
          endDate,
          status,
          rate,
          notes
        },
        { new: true }
      );

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete a project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 