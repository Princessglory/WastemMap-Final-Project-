const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Pickup = require('../models/Pickup');

const router = express.Router();

// Admin middleware - check if user is admin
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Get all users (admin only)
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role (admin only)
router.put('/users/:id/role', auth, adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    
    // Validate role
    if (!['user', 'collector', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get system statistics (admin only)
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCollectors = await User.countDocuments({ role: 'collector' });
    const totalPickups = await Pickup.countDocuments();
    const completedPickups = await Pickup.countDocuments({ status: 'completed' });
    const pendingPickups = await Pickup.countDocuments({ 
      status: { $in: ['pending', 'assigned'] } 
    });

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentPickups = await Pickup.find({
      createdAt: { $gte: sevenDaysAgo }
    })
    .populate('user', 'name email')
    .populate('assignedCollector', 'name')
    .sort({ createdAt: -1 })
    .limit(10);

    res.json({
      totalUsers,
      totalCollectors,
      totalPickups,
      completedPickups,
      pendingPickups,
      recentPickups
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
