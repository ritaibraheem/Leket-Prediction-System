const { spawn } = require('child_process');
// Run the Python script
function data_processing(file_to_process){
    return new Promise((resolve, reject) => {
        try {
            const pythonProcess = spawn('python', ['./processing/data_processing.py', file_to_process.path]);

            // Listen for Python script output
            pythonProcess.stdout.on('data', (data) => {
            console.log(`Python script output: ${data}`);
            reject(new Error(`Python script error: ${data}`)); 
            });

            // Listen for Python script errors
            pythonProcess.stderr.on('data', (data) => {
            console.error(`Python script error: ${data}`);
            reject(new Error(`Python script error: ${data}`)); 
            });

            // Handle Python script exit
            pythonProcess.on('close', (code) => {
            console.log(`Python script exited with code ${code}`);
            });

        } catch (error) {
            // File processing encountered an error
            console.error(error);
            res.status(500).send('Error processing file - data_processing.js.');
        }
    });
}
 
module.exports = data_processing