import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RepositorySchema = new Schema({
  githubId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  ownerModel: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, required: true },
  primaryLanguage: { type: String },
  url: { type: String, required: true }
});

export default mongoose.model('Repository', RepositorySchema);
