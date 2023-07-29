const express = require('express');
const router = express.Router();
const resultsService = require('./results.service');
const runPredModel = require('./runPredModel');

router.post('/', getAll);

async function getAll(req, res, next) {
    try {
        const {
            startDate,
            endDate,
            kind,
            maxTemp,
            minTemp,
            rain,
            snow,
            hail,
            gale,
            holidayStartDate,
            holidayEndDate
        } = req.body;

        // Call the function that generates the JSON result
        const result = await runPredModel(startDate, endDate, maxTemp, minTemp, rain, snow, hail, gale, kind, holidayStartDate, holidayEndDate);
        // Send the JSON result to the frontend
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing prediction.');
    }
}

module.exports = router;