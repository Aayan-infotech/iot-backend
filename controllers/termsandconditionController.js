// const Termsandcondition = require('../models/TermsandconditionModel');
const TermsandCondition = require('../models/termsandconditionModel');
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

// Create a new Termsandcondition post with images
exports.createTermsandcondition = async (req, res) => {
  const { title, category, content,date, author, status } = req.body;
  const image1 = req.files && req.files.image1 ? req.files.image1[0].filename : null;
  const image2 = req.files && req.files.image2 ? req.files.image2[0].filename : null;

  const newTermsandcondition = new TermsandCondition({
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
    const savedTermsandcondition = await newTermsandcondition.save();
    res.status(201).json(savedTermsandcondition);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all Termsandcondition posts
exports.getTermsandconditions = async (req, res) => {
  try {
    const Termsandconditions = await TermsandCondition.find();
    res.json(Termsandconditions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single Termsandcondition post by ID
exports.getTermsandconditionById = async (req, res) => {
  try {
    const Termsandcondition = await TermsandCondition.findById(req.params.id);
    res.json(Termsandcondition);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a Termsandcondition post with image handling
exports.updateTermsandcondition = async (req, res) => {
  try {
    const updateData = req.body;
    if (req.files && req.files.image1) {
      updateData.image1 = req.files.image1[0].filename;
    }
    if (req.files && req.files.image2) {
      updateData.image2 = req.files.image2[0].filename;
    }
    const updatedTermsandcondition = await TermsandCondition.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedTermsandcondition);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a Termsandcondition post
exports.deleteTermsandcondition = async (req, res) => {
  try {
    await Termsandcondition.findByIdAndDelete(req.params.id);
    res.json({ message: 'Termsandcondition deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
