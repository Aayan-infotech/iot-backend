const Patient = require('../models/patientModel');
const MeasureData = require('../models/measuredataModel');

// Sync Controller

exports.syncData = async (req, res) => {
    try {
        const { patientData, measureData } = req.body;

        // Check if patient exists by SSN
        let patient = await Patient.findOne({ SSN: patientData.SSN });

        if (patient) {
            // Update patient data if it already exists
            patient = await Patient.findOneAndUpdate(
                { SSN: patientData.SSN },
                { $set: patientData },
                { new: true }
            );
        } else {
            // Create a new patient if one doesn't exist
            patient = new Patient(patientData);
            await patient.save();
        }

        // Check if measure data exists for the given date and userId
        let existingMeasureData = await MeasureData.findOne({
            userId: measureData.userId,
            date: measureData.date,
        });

        if (existingMeasureData) {
            // If the date exists, return a message saying "Data already saved"
            return res.status(200).json({
                success: false,
                message: "Data already saved for this date",
                patient,
                measureData: existingMeasureData // Include the already saved data
            });
        } else {
            // Create new measure data if it doesn't exist
            const newMeasureData = new MeasureData(measureData);
            await newMeasureData.save();
            patient.measureData = newMeasureData._id;
            await patient.save();
        }

        // Fetch all measure data for this patient (by userId)
        const allMeasureData = await MeasureData.find({ userId: measureData.userId });

        // Send response back with synced patient data and all associated measure data
        res.status(200).json({
            success: true,
            message: "Data synced successfully",
            patient,
            measureData: allMeasureData // Include all measure data for the patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error syncing data",
            error: error.message,
        });
    }
};

