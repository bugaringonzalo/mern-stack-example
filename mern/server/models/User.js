import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'teacher'],
    default: 'user'
  },
  // resetPasswordToken: String,
  // resetPasswordExpire: Date,
  // isEmailVerified: {
  //   type: Boolean,
  //   default: false
  // },
  // emailVerificationToken: String,
  // emailVerificationExpire: Date,
  // validateBeforeSave: false
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);