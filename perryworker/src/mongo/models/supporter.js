import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SupporterSchema = new Schema({
  name: { type: String, required: true }
});

export default mongoose.model('Supporter', SupporterSchema);
