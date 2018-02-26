var mongoose = require('mongoose');
var { Schema } = mongoose;

const organizationSchema = new mongoose.Schema({
  githubId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  login: { type: String, required: true, unique: true, index: true }
});

module.exports = mongoose.model('organization', organizationSchema);
