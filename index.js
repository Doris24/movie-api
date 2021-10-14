const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');
const app = express();

let topMovies = [
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    year: '2001',
    genre: 'fantasy',
    director: 'Chris Columbus'
  },
  {
    title: 'Dirty Dancing',
    year: '1987'
  },
  {
    title: 'Sell Your Haunted House',
    year: '2021'
  },
  {
    title: 'Hotel del Luna',
    year: '2019'
  },
  {
    title: 'The Devil Wears Prada',
    year: '2006'
  },
  {
    title: 'Australia',
    year: '2008'
  },
  {
    title: 'Healer',
    year: '2014'
  },
  {
    title: 'The Heirs',
    year: '2013'
  },
  {
    title: 'Ballet Shoes',
    year: '2007'
  },
  {
    title: 'Winnetou',
    year: '1963'
  }
];

// USE

// logging middleware
app.use(morgan('common'));
// sending of static files
app.use(express.static('public'));

app.use(bodyParser.json());

// REQUESTS

app.get('/', (req,res) => {
  res.send('Welcome to the movie app!');
});

// get all movies
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// get data about movie by title
app.get('/movies/:title', (req, res) => {
  let movie = topMovies.find((movie) => {
    return movie.title === req.params.title;
  });
  res.json(movie);
});

// get data about genre
app.get('/genres/:genre', (req, res) => {
  res.send('Successful GET request returning data on a genre');
});

// get data about director
app.get('/directors/:director', (req, res) => {
  res.send('Successful GET request returning data on a director');
});

// new user
app.post('/register', (req, res) => {
  res.send('Successful POST to add information about a new user');
});

// update username
app.put('/users/:id/:username', (req, res) => {
  res.send('Successful PUT to update username');
});

// user can add movie to favList
app.post('/users/:id/favList/:title', (req, res) => {
  res.send('Successful POST to add a movie to favList');
});

// user can remove movie from favList
app.delete('/users/:id/favList/:title', (req, res) => {
  res.send('Successful DELETE to remove movie from favList');
});

// user can delete user
app.delete('/users/:id/unregister', (req, res) => {
  res.send('Successful DELETE to unregister user');
});


// ERROR
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening to port 8080.');
});