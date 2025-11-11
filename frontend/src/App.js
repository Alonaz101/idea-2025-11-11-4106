import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [mood, setMood] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!mood) {
      setError('Please enter your mood');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/recommendations', { mood });
      setRecipes(res.data);
    } catch (err) {
      setError('Failed to get recommendations');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Mood-based Recipe Recommendation</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your mood (e.g., happy, sad)"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
        <button type="submit">Get Recipes</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.recipeId}>
            <h3>{recipe.title}</h3>
            <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
            <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
