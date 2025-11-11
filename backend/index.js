const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/moodrecipe', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }
});

const RecipeSchema = new mongoose.Schema({
  recipeId: { type: String, required: true, unique: true },
  title: String,
  cuisine: String,
  ingredients: [String],
  instructions: String,
  moodTags: [String]
});

const FeedbackSchema = new mongoose.Schema({
  feedbackId: { type: String, required: true, unique: true },
  userId: String,
  recipeId: String,
  rating: Number,
  comments: String
});

const User = mongoose.model('User', UserSchema);
const Recipe = mongoose.model('Recipe', RecipeSchema);
const Feedback = mongoose.model('Feedback', FeedbackSchema);

// Routes

// POST /api/recommendations - Input mood, returns matching recipes
app.post('/api/recommendations', async (req, res) => {
  try {
    const { mood } = req.body;
    if (!mood) return res.status(400).json({ error: 'Mood is required' });

    // Basic rule-based recommendation: find recipes with matching moodTags
    const recipes = await Recipe.find({ moodTags: mood });
    res.json(recipes);
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/recipes/:id - Recipe details
app.get('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ recipeId: req.params.id });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/feedback - Submit feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { feedbackId, userId, recipeId, rating, comments } = req.body;
    if (!feedbackId || !userId || !recipeId || !rating) return res.status(400).json({ error: 'Missing fields in feedback' });

    const feedback = new Feedback({ feedbackId, userId, recipeId, rating, comments });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted' });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
