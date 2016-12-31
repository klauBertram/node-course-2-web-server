const express = require('express');
const fs = require('fs');
const hbs = require('hbs');

// heroku will provide a port
const port = process.env.PORT || 3000;

var app = express();

// add hbs to express
app.set('view engine', 'hbs');

// support for partial
hbs.registerPartials(__dirname + '/views/partials');

// middleware
// use method, register middleware
app.use((request, response, next) => {
  // next argument tells when your middleware is complete
  // you can have as many middleware as you like
  var now = new Date().toString();
  var log = `${now}: ${request.method} ${request.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (error) => {
    if(error){
      console.log('unable to append to server.log');
    }
  });

  // middleware complete, w/o next method
  // app will hang 
  next();
});

// app.use((request, response, next) => {
//   response.render('maintenance.hbs', {
//     pageTitle: 'Maintenance'
//   });
// });

// teach express how to read static directory
app.use(express.static(__dirname + '/public'));


// register helper for hbs
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

// http get request
app.get('/', (request, response) => {
  // response.send('<h1>hello express</h1>');
  // response.send({
  //   name: 'Kenn',
  //   likes: [
  //     'video games',
  //     'cities'
  //   ]
  // });
  response.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to the home page'
  });
});

app.get('/about', (request, response) => {
  // response.send('about page');
  response.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

// simulate when request failed
// errorMessage with type string
app.get('/bad', (request, response) => {
  response.send({
    errorMessage: 'unable to fullfilled this request'
  });
});

// bind app to the machine and listen to port
// takes a 2nd argument after app starts up
app.listen(port, () => {
  console.log(`server is up on port ${port}`);
});