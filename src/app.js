const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const documentRoutes = require('./routes/documentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(config.db.uri);

app.use(bodyParser.json());

app.use('/api', documentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});