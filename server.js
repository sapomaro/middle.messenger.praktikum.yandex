const express = require('express');
const path = require('path');

const distDir = path.join(__dirname, '/dist/');

const app = express();

const PORT = process.env.PORT || 3000;

app.disable('strict routing');

app.use(express.static(distDir));

app.get('*', function(req, res) {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, function() {
  console.log(`App listening on port ${PORT}!`);
});
