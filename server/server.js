// --------------------------------------------------
// Imports
// --------------------------------------------------

// Load the application's configuration
var config = require('./config');

// Required modules
var express             = require('express');
var bodyParser          = require('body-parser');
var path                = require('path');
var colors              = require('colors');

// --------------------------------------------------
// Start Message
// --------------------------------------------------

console.log('############################################################');
console.log('############################################################');
console.log('               STARTING SERVER...');
console.log('############################################################');
console.log('############################################################');

// Set up the express web server
var app = express();
// deliver all contents of the folder '/webapp' under '/'
app.use(express.static(path.join(__dirname, '../app')));

// enable processing of the received post content
app.use(bodyParser.urlencoded({extended: true})); 
// app.use(bodyParser.urlencoded({ extended: false }));

// --------------------------------------------------

// code which is executed on every request
app.use(function(req, res, next) {
    console.log(req.method + ' ' + req.url + ' was requested by ' + req.connection.remoteAddress);
    res.header('Access-Control-Allow-Origin', '*');    // allow CORS
    next();
});

// --------------------------------------------------
// Starting Services
// --------------------------------------------------

// Start the web server
var server = app.listen(config.express_port, function() {
    console.log('------------------------------------------------------------');
    console.log('  Express server listening on port', config.express_port.toString().cyan);
    console.log('------------------------------------------------------------');
});