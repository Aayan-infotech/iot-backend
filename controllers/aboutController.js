const About = require('../models/aboutModel'); // This imports the model with a capital 'A'
const multer = require('multer');
const path = require('path');

// Multer setup for storing images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Adjust the path to your preferred uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// File filter to allow only image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Incorrect file type');
    error.status = 400;
    return cb(error, false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// Create a new about post with images
exports.createabout = async (req, res) => {
  const { title, category, content, date, author, status } = req.body;
  const image1 = req.files && req.files.image1 ? req.files.image1[0].filename : null;
  const image2 = req.files && req.files.image2 ? req.files.image2[0].filename : null;

  const newabout = new About({ // Use About instead of about
    title,
    image1,
    image2,
    category,
    content,
    date,
    author,
    status,
  });

  try {
    const savedabout = await newabout.save();
    res.status(201).json(savedabout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all about posts
exports.getabouts = async (req, res) => {
  try {
    const abouts = await About.find(); // Use About instead of about
    res.json(abouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single about post by ID
exports.getaboutById = async (req, res) => {
  try {
    const about = await About.findById(req.params.id); // Use About instead of about
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a about post with image handling
exports.updateabout = async (req, res) => {
  try {
    const updateData = req.body;
    if (req.files && req.files.image1) {
      updateData.image1 = req.files.image1[0].filename;
    }
    if (req.files && req.files.image2) {
      updateData.image2 = req.files.image2[0].filename;
    }
    const updatedabout = await About.findByIdAndUpdate(req.params.id, updateData, { new: true }); // Use About instead of about
    res.json(updatedabout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a about post
exports.deleteabout = async (req, res) => {
  try {
    await About.findByIdAndDelete(req.params.id); // Use About instead of about
    res.json({ message: 'about deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
