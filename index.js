const express = require('express');
const app = express();

let topMovies = [
  {
    title: 'Hello1',
    author: 'Hi1'
  },
  {
    title: 'Hello2',
    author: 'Hi2'
  },
  {
    title: 'Hello3',
    author: 'Hi3'
  },
  {
    title: 'Hello4',
    author: 'Hi4'
  },
  {
    title: 'Hello5',
    author: 'Hi5'
  }
];

// USE
app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// GET requests
// app.get('/', (req,res) => {
//   res.send('Welcome to my movie club!');
// });
//
// app.get('/documentation', (req, res) => {
//   res.sendFile('/documentation.html');
// });
//
// app.get('/movies', (req, res) => {
//   res.json(topMovies);
// });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//listen for requests
app.listen(8080, () => {
  console.log('Your app is listening to port 8080.');
});
