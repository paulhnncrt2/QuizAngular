const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/quizDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Score schema and model
const scoreSchema = new mongoose.Schema({
  name: String,
  score: Number
});

const Score = mongoose.model('Score', scoreSchema);

// Routes
app.post('/scores', (req, res) => {
  console.log('POST /scores called');
  console.log('Request body:', req.body);

  const newScore = new Score({
    name: req.body.name,
    score: req.body.score
  });

  newScore.save()
    .then(() => {
      console.log('Score added successfully');
      res.status(201).send('Score added!');
    })
    .catch(err => {
      console.error('Error adding score:', err);
      res.status(400).send('Error: ' + err);
    });
});

app.get('/scores', (req, res) => {
    console.log('GET /scores called');
    Score.find()
      .sort({ score: -1 }) // Tri en ordre décroissant par score
      .then(scores => {
        console.log('Scores retrieved:', scores);
        res.json(scores);
      })
      .catch(err => {
        console.error('Error retrieving scores:', err);
        res.status(400).send('Error: ' + err);
      });
  });

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
