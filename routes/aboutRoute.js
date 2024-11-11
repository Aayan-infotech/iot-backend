const express = require('express');
const {
  createabout,
  getabouts,
  getaboutById,
  updateabout,
  deleteabout,
} = require('../controllers/aboutController');
const multer = require('multer');

// Multer setup for storing images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store the images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

const router = express.Router();

// Routes
router.post('/', upload.fields([{ name: 'image1' }, { name: 'image2' }]), createabout);
router.get('/', getabouts);
router.get('/:id', getaboutById);
router.put('/:id', upload.fields([{ name: 'image1' }, { name: 'image2' }]), updateabout);
router.delete('/:id', deleteabout);

module.exports = router;
