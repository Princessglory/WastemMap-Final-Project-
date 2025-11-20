const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all collectors (for admin/assignment)
router.get('/collectors', auth, async (req, res) => {
  try {
    const collectors = await User.find({ role: 'collector' }).select('name email phone');
    res.json(collectors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

