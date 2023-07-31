const { spawn } = require('child_process');

/**
 * Run the Python prediction model using child_process.spawn().
 * This function executes a Python script with the given input parameters and captures the output.
 
 * @returns {Promise<object>} A Promise that resolves with an object containing the prediction results and R-squared value.
 * The resolved object has the following properties:
 *   - result: An array containing the prediction results.
 *   - r2: The R-squared value indicating the accuracy of the predictions.
 */

function runPredModel(startDate, endDate, maxTemp, minTemp, rain, snow, hail, gale, kind, holidayStartDate, holidayEndDate) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['./results/predictionModel.py', startDate, endDate, maxTemp, minTemp, rain, snow, hail, gale, kind, holidayStartDate, holidayEndDate]);

    let result = ''; // Variable to store the result

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python script output: ${data}`);
      result += data.toString(); // Collect the output data
      // console.log(result);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python script error: ${data}`);
      reject(new Error(`Python script error: ${data}`)); // Reject the promise if there's an error
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`Python script exited with code ${code}`);
        try {
          const parsedResult = JSON.parse(result); // Parse the JSON result
          const { result: jsonResult, r2 } = parsedResult; // Extract the result and r2 values
          resolve({ result: jsonResult, r2 }); // Resolve the promise with the extracted values
        } catch (error) {
          reject(new Error(`Error parsing JSON result: ${error}`)); // Reject the promise if there's an error parsing the JSON
        }
      } else {
        console.error(`Python script exited with code ${code}`);
        reject(new Error(`Python script exited with code ${code}`)); // Reject the promise if the script fails
      }
    });
  });
}
module.exports = runPredModel;


