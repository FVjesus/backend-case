const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const documentRoutes = require('./routes/documentRoutes');
const authRoutes = require('./routes/authRoutes');
const auditRoutes = require('./routes/auditRoutes');
const User = require('./models/userModel');

mongoose.connect(config.db.uri);

(async () => {
  try {
    const adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      await User.createUser('admin', 'adminpassword', 'admin');
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
})();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/api', documentRoutes);
app.use('/audit', auditRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});