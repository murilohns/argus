var mongoose = require('mongoose');
var { Schema } = mongoose;

const PullRequestSchema = new Schema({
  githubId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  repositoryId: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: String, required: true },
  url: { type: String, required: true },
  bodyText: { type: String },
  author: { type: Schema.Types.ObjectId, required: true },
  commitsCount: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model('pullrequest', PullRequestSchema);
