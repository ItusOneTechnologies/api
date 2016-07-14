// BASE SETUP
// ==================================

// Call the packages
var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    morgan     = require('morgan'),
    mongoose   = require('mongoose'),
    jwt        = require('jsonwebtoken'),
    User       = require('./app/models/user'),
    config     = require('./config'),
    path       = require('path');

// App Congiguration ----------------
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to our database
mongoose.connect(config.database);

// set static files location
// used for requests that our frontend will make
app.use(express.static(__dirname + '/public'));


// REGISTER OUR ROUTES ----------------
// use these routes to register a new company/user
var registerRoutes = require('./app/routes/register')(app, express);
app.use('/register', registerRoutes);
// all of our API routes will be prefixed with /api
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// MAIN CATCHALL ROUTE ----------------
// SEND USERS TO THE FRONTEND ---------
// has to be registered after the API routes
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// START the SERVER
// =====================================
app.listen(config.port);
console.log('Server listening on port ' + config.port);
