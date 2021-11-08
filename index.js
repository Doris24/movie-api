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

// // allow Mongoose to connect to the db to perform CRUD operations
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewURLParser: true, useUnifiedTopology: true });

// allow Mongoose to connect to the db to perform CRUD operations with MongoDB Atlas
mongoose.connect( process.env.CONNECTION_URI, { useNewURLParser: true, useUnifiedTopology: true });

// CORS
const cors = require('cors');

let allowedOrigins = ['*'];
// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1) {
      // a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

// express-validator
const { check, validationResult } = require('express-validator');


// USE
// logging middleware
app.use(morgan('common'));
// sending of static files
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// import auth
let auth = require('./auth')(app);
// import passport
const passport = require('passport');
require('./passport.js');

// REQUESTS

app.get('/', (req,res) => {
  res.send('Welcome to movyis!');
});

// get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// get data about movie by title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// get all genres
app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.find()
    .then((genres) => {
      res.status(201).json(genres);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// get data about one genre
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.findOne({Name: req.params.Name })
    .then((genre) => {
      res.status(201).json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// get all directors
app.get('/directors', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.find()
    .then((directors) => {
      res.status(201).json(directors);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// get data about director
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.findOne({ Name: req.params.Name })
    .then((director) => {
      res.status(201).json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// get all users
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
})

// create new user
app.post('/users',
  // validation logic
  [
    check('Username', 'Username is required and should be at least 5 characters long.').isLength({min:5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not apper to be valid').isEmail()
  ], (req, res) => {
  // check vaidation object for errors
  let errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password); // storing hashed password in MongoDB database
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user && Object.keys(user).length > 0) {
        console.log(user);
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
          })
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// update user data
app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
  // validation logic
  [
    check('Username', 'Username is required and should be at least 5 characters long.').isLength({min:5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not apper to be valid').isEmail()
  ], (req, res) => {
  // check vaidation object for errors
  let errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password); // storing hashed password in MongoDB database
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $set: // specifies the fields to be updated
      {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }, // makes sure that the updated document is returned
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
  });
});

// user can add movie to favlist
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// user can remove movie from favlist
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// user can delete user
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found.');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) =>{
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});


// ERROR
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080; // looks for a pre-configured port number in the environment variable
// listen for requests
app.listen(port, '0.0.0.0',() => {
  console.log('Listening on Port ' + port);
});
