const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema(
  {
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
      required: true,
    },
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pickupTime: {
      type: Date,
      default: null,
    },
    deliveryTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
      default: 'ASSIGNED',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Pickup', pickupSchema);
