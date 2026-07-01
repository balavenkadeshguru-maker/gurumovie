const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },
  language: { type: String, enum: ['Tamil', 'Malayalam'], required: true },
  genres: [{ type: String, required: true }],
  year: { type: Number, required: true },
  rating: { type: Number, min: 0, max: 10, default: 0 },
  duration: { type: String, required: true }, // e.g. "2h 25m"
  director: { type: String, required: true },
  cast: [{ type: String }],
  releaseDate: { type: Date, required: true },
  synopsis: { type: String, required: true },
  posterUrl: { type: String }, // URL to a licensed/official poster image, not hosted content
  trailerUrl: { type: String }, // official YouTube trailer URL only
  platform: { type: String, required: true }, // e.g. "Netflix", "Prime Video"
  platformUrl: { type: String, required: true }, // official streaming platform link
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

MovieSchema.index({ title: 'text', genres: 'text', cast: 'text' });

module.exports = mongoose.model('Movie', MovieSchema);
