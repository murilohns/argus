var mongoose = require('mongoose');
var { Schema } = mongoose;

const RepositorySchema = new Schema({
  githubId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  ownerModel: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, required: true },
  primaryLanguage: { type: String },
  url: { type: String, required: true }
});

module.exports = mongoose.model('repository', RepositorySchema);
