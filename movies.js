const express = require('express');
const Movie = require('../models/Movie');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/movies?language=Tamil&genre=Action&search=vikram&page=1&limit=20
router.get('/', async (req, res) => {
  try {
    const { language, genre, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (language && language !== 'All') query.language = language;
    if (genre && genre !== 'All') query.genres = genre;
    if (search) query.$text = { $search: search };

    const movies = await Movie.find(query)
      .sort({ rating: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Movie.countDocuments(query);

    res.json({ movies, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch movies.', error: err.message });
  }
});

// GET /api/movies/:id
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    res.json(movie);
  } catch (err) {
    res.status(400).json({ message: 'Invalid movie id.' });
  }
});

// POST /api/movies  (admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const movie = await Movie.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create movie.', error: err.message });
  }
});

// PUT /api/movies/:id  (admin only)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    res.json(movie);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update movie.', error: err.message });
  }
});

// DELETE /api/movies/:id  (admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found.' });
    res.json({ message: 'Movie deleted.' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete movie.', error: err.message });
  }
});

module.exports = router;
