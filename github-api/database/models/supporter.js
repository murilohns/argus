var mongoose = require('mongoose');
var { Schema } = mongoose;

const SupporterSchema = new Schema({
  name: { type: String, required: true },
  user: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  slack_id: { type: String, required: true}
});

module.exports = mongoose.model('supporters', SupporterSchema);
