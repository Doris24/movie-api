/** Express router providing user related routes
 * @requires express
 */

// Load express framework and middleware libraries: Morgan, body-parser, uuid
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

// Import and use CORS
const cors = require('cors');

// Import Mongoose, models.js
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

/* Connecting to MongoDB */
// // allow Mongoose to connect to the db to perform CRUD operations
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewURLParser: true, useUnifiedTopology: true });

// allow Mongoose to connect to the db to perform CRUD operations with MongoDB Atlas
mongoose.connect(process.env.CONNECTION_URI, { useNewURLParser: true, useUnifiedTopology: true });

/* CORS */
app.use(cors());
// let allowedOrigins = ['*'];
// // let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
// app.use(cors({
//   origin: (origin, callback) => {
//     if(!origin) return callback(null, true);
//     if(allowedOrigins.indexOf(origin) === -1) {
//       // a specific origin isn’t found on the list of allowed origins
//       let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
//       return callback(new Error(message ), false);
//     }
//     return callback(null, true);
//   }
// }));

// express-validator to validate input fields
const { check, validationResult } = require('express-validator');


// USE
// logging middleware
app.use(morgan('common'));
// sending of static files
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// import auth
let auth = require('./auth')(app);
// import passport
const passport = require('passport');
require('./passport.js');

/* -------------ENDPOINTS------------- */
// REQUESTS
/**
 * GET: redirect to index.html
 * 
 * @name GetRoot
 * 
 * @param {string}  - Express path
 * @param {callback} middleware - Express middleware.
 */
app.get('/', (req, res) => {
  res.send('Welcome to movyis!');
});

/**
 * GET: get all movies.
 * @name get/movies
 * @function
 * @param {express.request} req
 * @param {express.response} res
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  //app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

/** 
 * GET: get data about movie by title
 * @name get/movies/:Title
 * @function
 * @param {express.request} req
 * @param {express.response} res
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * GET: get all genres
 * @name get/genres
 * @function
 * @param {express.request} req
 * @param {express.response} res
 */
app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.find()
    .then((genres) => {
      res.status(200).json(genres);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/** 
 * GET: get data about one genre by name
 * @name get/genres/:Name
 * @function
 * @param {express.request} req
 * @param {express.response} res
 */
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.findOne({ Name: req.params.Name })
    .then((genre) => {
      res.status(200).json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/** 
 * GET: get all directors
 * @name get/directors
 * @function
 * @param {express.request} req
 * @param {express.response} res
 */
app.get('/directors', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.find()
    .then((directors) => {
      res.status(200).json(directors);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/** 
 * GET: get data about director by name
 * @name get/directors/:Name
 * @function
 * @param {express.request} req
 * @param {express.response} res
 */
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.findOne({ Name: req.params.Name })
    .then((director) => {
      res.status(200).json(director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

/** 
 * GET: get all users
 * @name get/users
 * @function
 * @param {express.request} req
 * @param {express.response} res
 */
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/** 
 * GET: get one user by username
 * @name get/users/:Username
 * @function
 * @param {express.request} req
 * @param {express.response} res
 */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
})

/** 
 * POST: create new user
 * Expects: Username, Password, Email, Birthday(optional)
 * @name post/users
 * @function
 * @param {express.request} req
 * @param {express.response} res
 */
app.post('/users',
  // validation logic
  [
    check('Username', 'Username is required and should be at least 5 characters long.').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not apper to be valid').isEmail()
  ], (req, res) => {
    // check vaidation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
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
              res.status(200).json(user);
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

/** 
 * PUT: update user data by username
 * Expects: Username, Password, Email, Birthday(optional)
 * @name put/users/:Username
 * @function
 * @param {express.request} req
 * @param {express.response} res
 */
app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
  // validation logic
  [
    check('Username', 'Username is required and should be at least 5 characters long.').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not apper to be valid').isEmail()
  ], (req, res) => {
    // check vaidation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password); // storing hashed password in MongoDB database
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: // specifies the fields to be updated
        {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, // makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      });
  });

/** 
 * POST: user can add movie to favlist by MovieID
 * @name post/users/:Username/movies/:MovieID
 * @function
 * @param {express.request} req
 * @param {express.response} res
 */
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

/** 
 * DELETE: user can delete movie to favlist by MovieID
 * @name delete/users/:Username/movies/:MovieID
 * @function
 * @param {express.request} req
 * @param {express.response} res
 */
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

/** 
 * DELETE: delete a user's profile by username
 * @name delete/users/:Username
 * @function
 * @param {express.request} req
 * @param {express.response} res
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found.');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});


/**
 * 
 * @name ErrorHandler
 * @param  {} err
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

/**
 * defines port
 * listening to port 8080
 */
const port = process.env.PORT || 8080; // looks for a pre-configured port number in the environment variable
// listen for requests
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
