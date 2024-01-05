const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/userModel');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });

  res.json({ token });
}

exports.getProfile = async (req, res) => {
  res.json({ user: req.user });
}

exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const newUser = await User.createUser(username, password, role);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.listAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}