var http = require('http');
var fs = require('fs');
var pg = require('pg');
var express = require('express');
var app = express();

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

app.get('/', function(request, response) {
  response.render('pages/index');
});


app.get('/users', function(req, res) {

	client.query("SELECT * FROM skin.user;", function (err, qres) {
		if (err) {
			console.log("error");
		} else {
			console.log(qres.rows);
			console.log("GOT EHERER");
			res.json(qres.rows);
		}
	});

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
