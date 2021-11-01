const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

// Mongoose:
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

// allow Mongoose to connect to the db to perform CRUD operations
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewURLParser: true, useUnifiedTopology: true });

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
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// get data about movie by title
app.get('/movies/:title', (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// get all genres

app.get('/genre', (req, res) => {

});
// get data about genre
app.get('/genre/:name', (req, res) => {
  Movies.findOne({Genre  })
    .then((genre) => {
      res.status(201).json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
  res.send('Successful GET request returning data on a genre');
});

// get data about director
app.get('/directors/:director', (req, res) => {
  res.send('Successful GET request returning data on a director');
});

// get all movies
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// get one user by username
app.get('/users/:username', (req, res) => {
  Users.findOne({ Username: req.params.username })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
})

// new user
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

// update username
app.put('/users/:id', (req, res) => {
  res.send('Successful PUT to update username');
});

// user can add movie to favlist
app.post('/users/:id/favlist/:title', (req, res) => {
  res.send('Successful POST to add a movie to favlist');
});

// user can remove movie from favlist
app.delete('/users/:id/favlist/:title', (req, res) => {
  res.send('Successful DELETE to remove movie from favlist');
});

// user can delete user
app.delete('/users/:id', (req, res) => {
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
