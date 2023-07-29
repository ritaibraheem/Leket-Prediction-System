const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

app.get('/csvdata', (req, res) => {
  fs.readFile('C:\Users\salma\salma-app\src\assets\files\file.csv', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading CSV file');
      return;
    }

    const lines = data.split('\n');
    const headers = lines[0].split(',');

    const csvData = lines.slice(1).map((line) => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
    });

    res.json(csvData);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
