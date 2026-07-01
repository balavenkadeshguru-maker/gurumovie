const express = require('express');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/me
router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-password -resetToken -resetTokenExpires')
    .populate('watchlist favorites history.movie');
  res.json(user);
});

// POST /api/users/me/watchlist/:movieId  (toggle)
router.post('/me/watchlist/:movieId', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const idx = user.watchlist.findIndex(id => id.toString() === req.params.movieId);
  if (idx >= 0) user.watchlist.splice(idx, 1);
  else user.watchlist.push(req.params.movieId);
  await user.save();
  res.json({ watchlist: user.watchlist });
});

// POST /api/users/me/favorites/:movieId  (toggle)
router.post('/me/favorites/:movieId', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const idx = user.favorites.findIndex(id => id.toString() === req.params.movieId);
  if (idx >= 0) user.favorites.splice(idx, 1);
  else user.favorites.push(req.params.movieId);
  await user.save();
  res.json({ favorites: user.favorites });
});

// POST /api/users/me/history/:movieId  (log a view)
router.post('/me/history/:movieId', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.history = user.history.filter(h => h.movie.toString() !== req.params.movieId);
  user.history.unshift({ movie: req.params.movieId, viewedAt: new Date() });
  user.history = user.history.slice(0, 50);
  await user.save();
  res.json({ history: user.history });
});

module.exports = router;
