const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const User = require('./models/User');
const Donation = require('./models/Donation');
const Pickup = require('./models/Pickup');
const Notification = require('./models/Notification');

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Donation.deleteMany();
    await Pickup.deleteMany();
    await Notification.deleteMany();

    console.log('Creating demo users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    // 1. Admin
    const admin = await User.create({
      name: 'Platform Administrator',
      email: 'admin@smartfood.org',
      password: hashedPassword,
      phone: '+1-555-0100',
      role: 'Admin',
      address: 'Central Admin Office, Tech City',
      location: { latitude: 37.7749, longitude: -122.4194, city: 'San Francisco' },
    });

    // 2. Donor
    const donor = await User.create({
      name: 'Grand Horizon Restaurant',
      email: 'donor@restaurant.com',
      password: hashedPassword,
      phone: '+1-555-0111',
      role: 'Donor',
      address: '124 Market Street, Downtown',
      organizationName: 'Grand Horizon Hospitality',
      location: { latitude: 37.7833, longitude: -122.4167, city: 'San Francisco' },
    });

    // 3. NGO
    const ngo = await User.create({
      name: 'Hope Food Shelter & Foundation',
      email: 'ngo@hopefoundation.org',
      password: hashedPassword,
      phone: '+1-555-0122',
      role: 'NGO',
      address: '789 Community Drive, East District',
      organizationName: 'Hope Foundation',
      location: { latitude: 37.769, longitude: -122.446, city: 'San Francisco' },
    });

    // 4. Volunteer
    const volunteer = await User.create({
      name: 'Alex Rivera (Volunteer)',
      email: 'volunteer@community.org',
      password: hashedPassword,
      phone: '+1-555-0133',
      role: 'Volunteer',
      address: '456 Express Way, South District',
      location: { latitude: 37.75, longitude: -122.42, city: 'San Francisco' },
    });

    console.log('Creating sample food donations...');

    const now = new Date();
    const fourHoursLater = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    const pastTwoHours = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    // Donation 1: Pending (Active)
    const donation1 = await Donation.create({
      donorId: donor._id,
      foodName: '50 Veg Biryani Meal Boxes',
      category: 'Cooked Food',
      quantity: 50,
      unit: 'boxes',
      peopleServed: 50,
      preparationTime: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      availableUntil: fourHoursLater,
      pickupAddress: '124 Market Street, Downtown (Back Kitchen Entrance)',
      location: { latitude: 37.7833, longitude: -122.4167 },
      description: 'Freshly prepared aromatic vegetable biryani with raita. Hygienically packed in food-grade container boxes.',
      status: 'PENDING',
    });

    // Donation 2: Accepted by NGO
    const donation2 = await Donation.create({
      donorId: donor._id,
      foodName: '30 Fresh Bakery Sandwiches & Croissants',
      category: 'Bakery',
      quantity: 30,
      unit: 'items',
      peopleServed: 30,
      preparationTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      availableUntil: sixHoursLater,
      pickupAddress: '124 Market Street, Downtown',
      location: { latitude: 37.7833, longitude: -122.4167 },
      description: 'Surplus gourmet sandwiches and butter croissants from lunch buffet.',
      status: 'ACCEPTED',
      ngoId: ngo._id,
      acceptedAt: new Date(now.getTime() - 30 * 60 * 1000),
    });

    // Donation 3: Pickup Assigned to Volunteer
    const donation3 = await Donation.create({
      donorId: donor._id,
      foodName: '40 Packed Meals (Rice & Dal)',
      category: 'Rice',
      quantity: 40,
      unit: 'plates',
      peopleServed: 40,
      preparationTime: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      availableUntil: twoHoursLater,
      pickupAddress: '124 Market Street, Downtown',
      location: { latitude: 37.7833, longitude: -122.4167 },
      description: 'Nutritious steamed rice and lentil dal prepared for event.',
      status: 'PICKUP_ASSIGNED',
      ngoId: ngo._id,
      volunteerId: volunteer._id,
      acceptedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    });

    await Pickup.create({
      donationId: donation3._id,
      volunteerId: volunteer._id,
      ngoId: ngo._id,
      status: 'ASSIGNED',
    });

    // Donation 4: Delivered
    const donation4 = await Donation.create({
      donorId: donor._id,
      foodName: '25 KG Fresh Fruits & Organic Apples',
      category: 'Fruits',
      quantity: 25,
      unit: 'kg',
      peopleServed: 60,
      preparationTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      availableUntil: new Date(now.getTime() + 12 * 60 * 60 * 1000),
      pickupAddress: '124 Market Street, Downtown',
      location: { latitude: 37.7833, longitude: -122.4167 },
      description: 'Crisp organic apples and bananas rescued from catered event.',
      status: 'DELIVERED',
      ngoId: ngo._id,
      volunteerId: volunteer._id,
      acceptedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      deliveredAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    });

    await Pickup.create({
      donationId: donation4._id,
      volunteerId: volunteer._id,
      ngoId: ngo._id,
      pickupTime: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      deliveryTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      status: 'DELIVERED',
    });

    // Donation 5: Expired
    await Donation.create({
      donorId: donor._id,
      foodName: '15 Packaged Snack Boxes',
      category: 'Packaged Food',
      quantity: 15,
      unit: 'packets',
      peopleServed: 15,
      preparationTime: new Date(now.getTime() - 8 * 60 * 60 * 1000),
      availableUntil: pastTwoHours,
      pickupAddress: '124 Market Street, Downtown',
      location: { latitude: 37.7833, longitude: -122.4167 },
      description: 'Assorted breakfast snack packages.',
      status: 'EXPIRED',
    });

    // Seed notifications
    await Notification.create({
      userId: donor._id,
      message: 'Welcome to SmartFood Platform! Your donor account is active.',
      type: 'SYSTEM',
    });

    await Notification.create({
      userId: ngo._id,
      message: 'New donation "50 Veg Biryani Meal Boxes" is available near your location.',
      type: 'SYSTEM',
      link: '/ngo/dashboard',
    });

    await Notification.create({
      userId: volunteer._id,
      message: 'Pickup request assigned for "40 Packed Meals (Rice & Dal)".',
      type: 'PICKUP_ASSIGNED',
      link: '/volunteer/dashboard',
    });

    console.log('=====================================================');
    console.log('SUCCESS! Database seeded with demo accounts & data:');
    console.log('ADMIN:     admin@smartfood.org     / Password123!');
    console.log('DONOR:     donor@restaurant.com    / Password123!');
    console.log('NGO:       ngo@hopefoundation.org  / Password123!');
    console.log('VOLUNTEER: volunteer@community.org / Password123!');
    console.log('=====================================================');

    if (require.main === module) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    if (require.main === module) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
