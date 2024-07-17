import mongoose from 'mongoose';

const BedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Bed', BedSchema);