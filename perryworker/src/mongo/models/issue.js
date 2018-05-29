import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
  githubId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  bodyText: { type: String, required: false },
  state: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, required: true },
  authorId: { type: Schema.Types.ObjectId, required: true },
  assignees: { type: [ Schema.Types.ObjectId ] },
  supportAssignee: { type: Schema.Types.ObjectId },
  repositoryId: { type: Schema.Types.ObjectId, required: true },
  commentsCount: { type: Number, default: 0 }
});

export default mongoose.model('Issue', IssueSchema);
