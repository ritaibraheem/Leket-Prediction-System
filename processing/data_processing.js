const { spawn } = require('child_process');
// Run the Python script
function data_processing(file_to_process){
    console.log('start running python file');
    return new Promise((resolve, reject) => {
        try {
            const pythonProcess = spawn('python', ['./processing/data_processing.py', file_to_process.path]);

            let result = '';
            
            // Listen for Python script output
            pythonProcess.stdout.on('data', (data) => {
            result += data.toString(); // Collect the output data 
            });

            // Listen for Python script errors
            pythonProcess.stderr.on('data', (data) => {
            reject(new Error(`Python script error: ${data}`)); 
            });

            // Handle Python script exit
            pythonProcess.on('close', (code) => {
            if (code === 0) {
                console.log(`Python script exited with code ${code}`);
                try {
                  const parsedResult = JSON.parse(result); // Parse the JSON result
                  const { result: jsonResult} = parsedResult; // Extract the result and r2 values
                  resolve({ result: jsonResult}); // Resolve the promise with the extracted values
                } catch (error) {
                  reject(new Error(`Error parsing JSON result: ${error}`)); // Reject the promise if there's an error parsing the JSON
                }
              } else {
                reject(new Error(`Python script exited with code ${code}`)); // Reject the promise if the script fails
              }
            });

        } catch (error) {
            // File processing encountered an error
            console.error(error);
            res.status(500).send('Error processing file - data_processing.js.');
        }
    });
}
 
module.exports = data_processing