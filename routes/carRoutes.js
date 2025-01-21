const express = require('express');
const multer = require('multer');
const path = require('path');
const Car = require('../models/Car');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save the images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Naming the file uniquely
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'), false);
    }
  }
});

// Create a New Car Entry with Image Upload
router.post('/add-cars', upload.array('images', 10), async (req, res) => {
  try {
    const { carModel, price, phoneNumber, maxPictures, user } = req.body;
    const imagePaths = req.files.map(file => file.path);

    // Validate input
    if (!carModel || carModel.length < 3)
      return res.status(400).json({ message: 'Car model must be at least 3 characters long.' });

    if (!/^[0-9]{11}$/.test(phoneNumber))
      return res.status(400).json({ message: 'Phone number must be exactly 11 digits.' });

    if (maxPictures < 1 || maxPictures > 10)
      return res.status(400).json({ message: 'Max pictures must be between 1 and 10.' });

    // Create car entry
    const car = await Car.create({ carModel, price, phoneNumber, maxPictures, images: imagePaths, user });
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create car entry', error: err.message });
  }
});

// Fetch All Cars
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cars', error: err.message });
  }
});

module.exports = router;
