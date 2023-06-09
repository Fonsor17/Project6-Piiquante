const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Checking the uniqueness of the e-mail address
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);