const express = require('express');
const path = require('path');

const app = express();
const DIST_DIR = path.join(__dirname, '/dist/');
const PORT = process.env.PORT || 3000;

app.disable('strict routing');

app.use(express.static(DIST_DIR));

app.get('*', function(req, res) {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, function() {
  console.log(`App listening on port ${PORT}!`);
});
