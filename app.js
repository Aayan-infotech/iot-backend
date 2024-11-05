require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require("multer");
const path = require("path");
const createError = require('./middleware/error');


// Import routes
const roleRoute = require('./routes/roleRoute');
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const patientRoute = require('./routes/patientRoute');
const measureRoutes = require('./routes/measureRoute');
const { createPDF } = require('./functions/generatepdf');
const dataSyncRoute = require('./routes/dataSyncRoute');
const about = require('./routes/aboutRoute');
const privacypolicy = require('./routes/privacypolicyRoute');
const termsandcondition = require('./routes/termsandconditionRoute');

// Environment variables
const PORT = process.env.PORT || 9006;
const MONGO_URL = process.env.MONGO_URL;
const FRONTEND = process.env.FRONTEND;

const app = express();

const corsOptions = {
  origin: '*', // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middleware setup
app.use(cors(corsOptions));
app.use(bodyParser.json()); // Keep only one instance
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// PDF generation route
app.post('/api/patient/generate-pdf', async (req, res) => {
  try {
    const { userId, date } = req.body;

    if (!userId || !date) {
      return res.status(400).json({ error: 'Both userId and date are required' });
    }

    const { pdfBuffer, filePath } = await createPDF(userId, date);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Client-Report-${userId}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'PDF generation failed' });
  }
});

// Register routes
app.use('/api/role', roleRoute);
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/patient', patientRoute);
app.use('/api/measures', measureRoutes);
app.use('/api', dataSyncRoute);
app.use('/api/about', about);
app.use('/api/privacypolicy', privacypolicy);
app.use('/api/termsandcondition', termsandcondition);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Something went wrong!';
  return res.status(statusCode).json({
    success: [200, 201, 204].includes(err.status),
    status: statusCode,
    message: message,
    data: err.data,
  });
});

// Database connection
mongoose.set('strictQuery', false);
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });