const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Car = require('../models/Car');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

router.post('/add-cars', upload.array('images', 10), async (req, res) => {
  try {
    const { carModel, price, phoneNumber, maxPictures, user } = req.body;
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    if (!carModel || carModel.length < 3) {
      return res.status(400).json({ message: 'Car model must be at least 3 characters long.' });
    }

    if (!/^[0-9]{11}$/.test(phoneNumber)) {
      return res.status(400).json({ message: 'Phone number must be exactly 11 digits.' });
    }

    if (maxPictures < 1 || maxPictures > 10) {
      return res.status(400).json({ message: 'Max pictures must be between 1 and 10.' });
    }

    const car = await Car.create({
      carModel,
      price,
      phoneNumber,
      maxPictures,
      images: imagePaths,
      user,
    });

    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create car entry', error: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cars', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    
    car.images.forEach(imgPath => {
      const fullPath = path.join(__dirname, '..', imgPath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    await Car.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete car', error: err.message });
  }
});

module.exports = router;
