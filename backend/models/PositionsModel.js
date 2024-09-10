const mongoose = require('mongoose');
const { PositionsSchema } = require('../schemas/PositionsSchema');

// Create the model using mongoose.model
const PositionsModel = mongoose.model('Position', PositionsSchema);

module.exports = { PositionsModel };
