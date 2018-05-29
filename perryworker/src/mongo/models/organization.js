import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const organizationSchema = new mongoose.Schema({
  githubId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  login: { type: String, required: true, unique: true, index: true }
});

export default mongoose.model('Organization', organizationSchema);
