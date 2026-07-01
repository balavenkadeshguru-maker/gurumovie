const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // bcrypt hash, never plaintext
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  history: [{
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    viewedAt: { type: Date, default: Date.now }
  }],
  resetToken: { type: String, default: null },
  resetTokenExpires: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
