import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  login: { type: String, required: true, unique: true },
  avatarUrl: { type: String, required: true },
  url: { type: String, required: true }
});

export default mongoose.model('User', UserSchema);
