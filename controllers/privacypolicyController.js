const Privacypolicy = require('../models/privacypolicyModel'); // Import the correct model
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

// Create a new privacy policy entry with images
exports.createprivacypolicy = async (req, res) => {
  const { title, category, content, date, author, status } = req.body;
  const image1 = req.files && req.files.image1 ? req.files.image1[0].filename : null;
  const image2 = req.files && req.files.image2 ? req.files.image2[0].filename : null;

  // Use the correct model for creating the entry
  const newprivacypolicy = new privacypolicy({
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
    const savedprivacypolicy = await newprivacypolicy.save();
    res.status(201).json(savedprivacypolicy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all privacy policy entries
exports.getprivacypolicys = async (req, res) => {
  try {
    const privacypolicys = await privacypolicy.find();
    res.json(privacypolicys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single privacy policy entry by ID
exports.getprivacypolicyById = async (req, res) => {
  try {
    const privacypolicy = await Privacypolicy.findById(req.params.id);
    res.json(privacypolicy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a privacy policy entry with image handling
exports.updateprivacypolicy = async (req, res) => {
  try {
    const updateData = req.body;
    if (req.files && req.files.image1) {
      updateData.image1 = req.files.image1[0].filename;
    }
    if (req.files && req.files.image2) {
      updateData.image2 = req.files.image2[0].filename;
    }
    const updatedprivacypolicy = await Privacypolicy.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedprivacypolicy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a privacy policy entry
exports.deleteprivacypolicy = async (req, res) => {
  try {
    await privacypolicy.findByIdAndDelete(req.params.id);
    res.json({ message: 'privacypolicy deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
