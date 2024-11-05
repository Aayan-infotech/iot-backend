const express = require('express');
const {
  createprivacypolicy,
  getprivacypolicys,
  getprivacypolicyById,
  updateprivacypolicy,
  deleteprivacypolicy,
} = require('../controllers/privacypolicyController');
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
router.post('/', upload.fields([{ name: 'image1' }, { name: 'image2' }]), createprivacypolicy);
router.get('/', getprivacypolicys);
router.get('/:id', getprivacypolicyById);
router.put('/:id', upload.fields([{ name: 'image1' }, { name: 'image2' }]), updateprivacypolicy);
router.delete('/:id', deleteprivacypolicy);

module.exports = router;
