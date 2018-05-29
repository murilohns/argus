import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CommentSchema = new mongoose.Schema({
  githubId: { type: String, required: true, unique: true },
  bodyText: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  model: { type: String },
  modelId: { type: Schema.Types.ObjectId }
});

export default mongoose.model('Comment', CommentSchema);
