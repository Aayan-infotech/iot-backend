const express = require('express');
const {
  createTermsandcondition,
  getTermsandconditions,
  getTermsandconditionById,
  updateTermsandcondition,
  deleteTermsandcondition,
} = require('../controllers/termsandconditionController');
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
router.post('/', upload.fields([{ name: 'image1' }, { name: 'image2' }]), createTermsandcondition);
router.get('/', getTermsandconditions);
router.get('/:id', getTermsandconditionById);
router.put('/:id', upload.fields([{ name: 'image1' }, { name: 'image2' }]), updateTermsandcondition);
router.delete('/:id', deleteTermsandcondition);

module.exports = router;
