const express = require('express'),
  morgan = require('morgan');
const app = express();

let topMovies = [
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    year: '2001'
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

// GET requests
app.get('/', (req,res) => {
  res.send('Welcome to the movie app!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
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
