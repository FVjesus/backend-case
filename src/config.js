require('dotenv').config();

module.exports = {
  db: {
    uri: process.env.DB_URI,
  },
  jwtSecret: 'asveathas124',
};