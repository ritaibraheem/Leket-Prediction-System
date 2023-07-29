const express = require('express');
const router = express.Router();
const multer = require('multer');
const data_processing = require('./data_processing.js');

// Set up multer middleware to handle file uploads
const upload = multer({ dest: 'uploads/' });

// Export the middleware function to handle the file upload
exports.uploadFile = upload.single('file');

router.post('/', upload.single('file'), updateFile);

module.exports = router;

async function updateFile(req, res, next) {
    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        // Call the data_processing function with the file
        file_to_process = req.file;
        const result = await data_processing(req.file)
        // Send the JSON result to the frontend
        res.status(200).json(result);
        
        // res.status(200).send('File uploaded and processed successfully.');
        
    } catch (error) {
        // File processing encountered an error
        console.error(error);
        res.status(500).send('Error processing file - processing.controller.js');
    }
} 

