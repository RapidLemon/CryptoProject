const express = require('express');
const path = require('path');
const fs = require('fs').promises; // Using promises for file operations

const app = express();
const port = 3000;

// Set the static folder to serve your HTML, CSS, and other static files
app.use(express.static(path.join(__dirname, '')), express.json());

// Define a route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '', 'index.html'));
});

// Define a route for the "/home" path
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home', 'index.html'));
});

// Define a route to handle the client's action and write to a file
app.post('/writeToFile', async (req, res) => {
  try {
      const { fileName, data } = req.body;

      if (!fileName || !data) {
          throw new Error('fileName or data is missing in the request body');
      }

      const filePath = path.join(__dirname, fileName);
      await fs.writeFile(filePath, JSON.stringify(data).slice(1, -1));

      res.send('Data successfully written to the file');
  } catch (error) {
      console.error('Error writing to file:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, '192.168.15.113', () => {
  console.log(`Server is running at http://192.168.15.113:${port}`);
});