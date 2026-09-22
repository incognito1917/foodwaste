const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    foodName: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Cooked Food', 'Rice', 'Vegetables', 'Fruits', 'Bakery', 'Packaged Food', 'Other'],
      required: [true, 'Food category is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unit: {
      type: String,
      enum: ['kg', 'plates', 'boxes', 'packets', 'items'],
      default: 'kg',
    },
    peopleServed: {
      type: Number,
      required: [true, 'Estimated number of people served is required'],
      min: [1, 'Must serve at least 1 person'],
    },
    preparationTime: {
      type: Date,
      required: [true, 'Preparation time is required'],
    },
    availableUntil: {
      type: Date,
      required: [true, 'Available until date/time is required'],
    },
    pickupAddress: {
      type: String,
      required: [true, 'Pickup address is required'],
    },
    location: {
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'PICKUP_ASSIGNED', 'PICKED_UP', 'DELIVERED', 'EXPIRED', 'CANCELLED'],
      default: 'PENDING',
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual check to dynamic update status if availableUntil has passed
donationSchema.methods.checkExpiry = function () {
  if (
    this.status !== 'DELIVERED' &&
    this.status !== 'CANCELLED' &&
    this.status !== 'EXPIRED' &&
    new Date() > new Date(this.availableUntil)
  ) {
    this.status = 'EXPIRED';
    return true;
  }
  return false;
};

module.exports = mongoose.model('Donation', donationSchema);
