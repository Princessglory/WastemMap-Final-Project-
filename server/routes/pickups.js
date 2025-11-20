const express = require('express');
const auth = require('../middleware/auth');
const Pickup = require('../models/Pickup');
const User = require('../models/User');

const router = express.Router();

// Create pickup request
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating pickup request for user:', req.user.id);
    console.log('Request body:', req.body);
    
    const pickup = await Pickup.create({
      ...req.body,
      user: req.user.id,
    });

    const populatedPickup = await Pickup.findById(pickup._id).populate('user', 'name email phone');
    
    console.log('Pickup created successfully:', populatedPickup._id);
    res.status(201).json(populatedPickup);
  } catch (error) {
    console.error('Error creating pickup:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's pickup requests
router.get('/my-pickups', auth, async (req, res) => {
  try {
    console.log('Fetching pickups for user:', req.user.id);
    const pickups = await Pickup.find({ user: req.user.id })
      .populate('assignedCollector', 'name phone')
      .sort({ createdAt: -1 });
    
    console.log('Found pickups:', pickups.length);
    res.json(pickups);
  } catch (error) {
    console.error('Error fetching pickups:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all pickups (for collectors/admins) - ENHANCED VERSION
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    let query = {};
    
    // If user is collector, show all pickups (they can see available ones)
    // If user is regular user, only show their pickups
    if (req.user.role === 'user') {
      query.user = req.user.id;
    }
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const pickups = await Pickup.find(query)
      .populate('user', 'name email phone address')
      .populate('assignedCollector', 'name phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Pickup.countDocuments(query);

    res.json({
      pickups,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error('Error fetching pickups:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update pickup status - ENHANCED VERSION
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status, actualDuration } = req.body;
    const updateData = { status };

    // Validate status transition
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup not found' });
    }

    // Check if collector is assigned to this pickup
    if (req.user.role === 'collector' && pickup.assignedCollector?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this pickup' });
    }

    if (status === 'completed') {
      updateData.completedDate = new Date();
      if (actualDuration) {
        updateData.actualDuration = actualDuration;
      }
    }

    const updatedPickup = await Pickup.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('user assignedCollector', 'name email phone');

    res.json(updatedPickup);
  } catch (error) {
    console.error('Error updating pickup status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign collector to pickup - ENHANCED VERSION
router.patch('/:id/assign', auth, async (req, res) => {
  try {
    const { collectorId } = req.body;
    
    // Verify the collector exists and has collector role
    const collector = await User.findById(collectorId);
    if (!collector || collector.role !== 'collector') {
      return res.status(400).json({ message: 'Invalid collector' });
    }

    const pickup = await Pickup.findByIdAndUpdate(
      req.params.id,
      {
        assignedCollector: collectorId,
        status: 'assigned',
      },
      { new: true }
    ).populate('user assignedCollector', 'name email phone');

    if (!pickup) {
      return res.status(404).json({ message: 'Pickup not found' });
    }

    res.json(pickup);
  } catch (error) {
    console.error('Error assigning collector:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate completed pickup
router.patch('/:id/rate', auth, async (req, res) => {
  try {
    const { score, comment } = req.body;
    
    const pickup = await Pickup.findById(req.params.id);
    
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup not found' });
    }
    
    // Only allow rating completed pickups
    if (pickup.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed pickups' });
    }
    
    // Only allow the user who requested the pickup to rate it
    if (pickup.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to rate this pickup' });
    }
    
    pickup.rating = { score, comment };
    await pickup.save();
    
    res.json(pickup);
  } catch (error) {
    console.error('Error rating pickup:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
