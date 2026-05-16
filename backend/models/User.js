const mongoose = require('mongoose');

const PasswordHistorySchema = new mongoose.Schema({
  hash: { type: String, required: true },
  changedAt: { type: Date, default: Date.now }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  fullName: { type: String, trim: true },
  passwordHash: { type: String, required: true },
  passwordChangedAt: { type: Date, default: Date.now },
  passwordHistory: { type: [PasswordHistorySchema], default: [] },
  isTempPassword: { type: Boolean, default: false },
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  lastLogin: { type: Date, default: null },
  resetPasswordTokenHash: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  enable2FA: { type: Boolean, default: false },
  twoFactorOTPHash: { type: String, default: null },
  twoFactorOTPExpires: { type: Date, default: null },
  state: { type: String, trim: true },
  city: { type: String, trim: true },
  phone: { type: String, trim: true },
  gender: { type: String, enum: ['male', 'female', 'non-binary', 'other'] },
  dob: { type: Date },
  profileImage: { type: String, default: null },
  backgroundImage: { type: String, default: null },
  bio: { type: String, trim: true },
  walletBalance: { type: Number, default: 100000 }
}, { timestamps: true });

UserSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

module.exports = mongoose.model('User', UserSchema);
