var mongoose = require('mongoose');
var { Schema } = mongoose;

const CommentSchema = Schema({
  githubId: { type: String, required: true, unique: true },
  bodyText: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  model: { type: String },
  modelId: { type: Schema.Types.ObjectId }
});

module.exports = mongoose.model('comment', CommentSchema);
