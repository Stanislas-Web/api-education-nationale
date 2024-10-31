// controllers/CommissionController.js

const Commission = require('../models/commission.model');
const User = require('../models/user.model'); // To reference User if needed

// Create a new Commission
exports.createCommission = async (req, res) => {
  try {
    const { name, creationDate, objective, initiator, candidate, position, direction, service, status } = req.body;

    const commission = new Commission({
      name,
      creationDate,
      objective,
      initiator,
      candidate,
      position,
      direction,
      service,
      status,
    });

    await commission.save();
    res.status(201).json(commission);
  } catch (error) {
    res.status(500).json({ message: 'Error creating commission', error });
  }
};

// Get all Commissions
exports.getAllCommissions = async (req, res) => {
  try {
    const commissions = await Commission.find().populate('initiator', 'nom prenom email');
    res.status(200).json(commissions);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving commissions', error });
  }
};

// Get a Commission by ID
exports.getCommissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const commission = await Commission.findById(id).populate('initiator', 'nom prenom email');

    if (!commission) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    res.status(200).json(commission);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving commission', error });
  }
};

// Update a Commission by ID
exports.updateCommission = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const commission = await Commission.findByIdAndUpdate(id, updates, { new: true }).populate('initiator', 'nom prenom email');

    if (!commission) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    res.status(200).json(commission);
  } catch (error) {
    res.status(500).json({ message: 'Error updating commission', error });
  }
};

// Delete a Commission by ID
exports.deleteCommission = async (req, res) => {
  try {
    const { id } = req.params;

    const commission = await Commission.findByIdAndDelete(id);

    if (!commission) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    res.status(200).json({ message: 'Commission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting commission', error });
  }
};
