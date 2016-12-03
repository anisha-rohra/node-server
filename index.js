var http = require('http');
var fs = require('fs');
var pg = require('pg');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var routes = require('./routes/routes');
var app = express();
var path = require('path');
var uuidV4 = require('uuid/v4');

// Establish database connection
pg.defaults.ssl = true; //always keep true!!!
var conString = "postgres://uurvdosruvrxjz:YS7FYSfT5DFBEXHRZvuxJXOIo4@ec2-54-235-217-221.compute-1.amazonaws.com:5432/dbrvvj2if6d8if"
client = new pg.Client(conString);
client.connect(function(err) {
	//error
	if (err) {
		return console.error('could not connect to postgres', err);
	}
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Set up to use a session
app.use(cookieParser('SECRET'));
app.use(session({
		secret:'notsosecret'
}));

// Middleware that simplifies the process of parsing and reading the request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // Supports URL encoded bodies
	extended:true
}));

/*
 * The section below refers to the API all the routes that this API will support
 * will be defined here. Developers should take a closer look to pre-requisites
 * and post-requisites for each one of the handlers of the HTTP endpoint
 */

app.get('/', function(request, response) {
  response.render('pages/index');
});


//GET All Users
//Endpoint also handles requests with queries:
	// Queries: - /users?username=username
	//					- /users?email=email
app.get('/users', routes.getUsers,routes.getUsersByName, routes.getByEmail);
app.get('/user-bynamepasswd', routes.getUserByNamePassword);
app.post('/users',routes.postUser);

app.get('/entry', routes.getEntryByEntryID);
app.get('/entries', routes.getEntriesByUserID);
app.post('/entry', routes.addEntry, routes.addEntryWithPhoto);
app.post('/delete-entry', routes.deleteEntry);
app.post('/edit-entry', routes.editEntry);

app.get('/products', routes.getProducts, routes.getProductById);
app.post('/products', routes.addProduct);

app.post('/upload-photo', routes.uploadPhoto);
app.get('/photo', routes.getPhoto);

app.get('/avg-rating', routes.getAvgRating);
app.get('/max-rating', routes.getMaxRating);
//app.get('/user-products', routes.getProductsByEntry);


app.get('/entry-products', routes.getProductsByEntry);
app.get('/user-products', routes.getUserProducts);


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
