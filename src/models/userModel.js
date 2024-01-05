const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, 
});

userSchema.statics.createUser = async function (username, password, role = 'user') {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.create({ username, password: hashedPassword, role });
  } catch (error) {
    throw error;
  }
};

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;