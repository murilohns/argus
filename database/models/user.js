var mongoose = require('mongoose');
var { Schema } = mongoose;

const UserSchema = new Schema({
  login: { type: String, required: true, unique: true },
  avatarUrl: { type: String, required: true },
  url: { type: String, required: true }
});

module.exports = mongoose.model('user', UserSchema);
