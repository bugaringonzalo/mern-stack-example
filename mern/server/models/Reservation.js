// import { max, min } from 'date-fns';
import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  createdByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bed',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // Matches hh:mm format
        if (!timePattern.test(v)) return false; // Ensures the format is correct
        const [hours, minutes] = v.split(':').map(Number); // Splits and converts to number
        const totalMinutes = hours * 60 + minutes; // Converts time to minutes for comparison
        const startMinutes = 8 * 60; // 8:00 in minutes
        const endMinutes = 20 * 60; // 20:00 in minutes
        return totalMinutes >= startMinutes && totalMinutes <= endMinutes; // Checks if within range
      },
      message: props => `${props.value} is not within the allowed time range (08:00 - 20:00)`
    },
    // validate: {
    //   max: 20
    //   min: 8
    // }
  }
}, { timestamps: true });

export default mongoose.model('Reservation', ReservationSchema);