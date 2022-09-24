const express = require('express');

const app = express();

process.env.PORT = 3000;

app.use(express.static('./dist/'));

app.listen(process.env.PORT, function() {
  console.log(`Example app listening on port ${process.env.PORT}!`);
});
