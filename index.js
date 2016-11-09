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
			res.json(qres.rows);
		}
	});

});

app.get('/entry/:userID', function(req, res) {

    //This queries the database and returns the rows from the database
	var id = req.params.userID;
	//TimeStamp entryDate = '2016-11-09 17:55:20.268058';
	client.query("SELECT * FROM skin.entry where userid = "+id+ " ;", function (err, qres) {
		if (err) {
			console.log("error");
		} else {
		//	console.log("qres is " + qres);
			console.log(qres.rows);
			res.json(qres.rows);
		}
	});

});

//Post request for add entry
/*app.post('/add-entry', function(req, res) {
    var entryID = DEFAULT;//req.body.entryID;
    var userID = 2;//req.body.userID;
    var date = DEFAULT;// req.body.date;
		var photoLocation = 'a';//req.body.photoLocation;
		var entryDescription = 'hey';//req.body.entryDescription;
		var rating = 4;//req.body.rating;

		client.query('INSERT INTO "skin.entry" VALUES ($1, $2, $3, $4, $5, $6);',
			 [entryID, userID, date, photoLocation, entryDescription,rating], function(err, result) {
					 if (err) {
							 console.log(err);
					 } else {
							 console.log("New entry inserted: " + entryID);

					 }
			 });
});

//Post request for edit entry
app.post('/edit-entry', function(req, res) {
    var entryID = DEFAULT;//req.body.entryID;
    var userID = 3;//req.body.userID;
    var date = DEFAULT;// req.body.date;
		var photoLocation = 'b';//req.body.photoLocation;
		var entryDescription = 'hey2';//req.body.entryDescription;
		var rating = 5;//req.body.rating;

		client.query('UPDATE "skin.entry" VALUES ($1, $2, $3, $4, $5, $6);',
			 [entryID, userID, date, photoLocation, entryDescription,rating], function(err, result) {
					 if (err) {
							 console.log(err);
					 } else {
							 console.log("Updated Entry: " + entryID);

					 }
			 });
});

//var entryID = DEFAULT;//req.body.entryID;
var userID = 2;//req.body.userID;
//var date = DEFAULT;// req.body.date;
var photoLocation = 'a';//req.body.photoLocation;
var entryDescription = 'hey';//req.body.entryDescription;
var rating = 4;//req.body.rating;

client.query('INSERT INTO skin.entry VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4);',
	 [userID, photoLocation, entryDescription,rating], function(err, result) {
			 if (err) {
					 console.log(err);
			 } else {
					 console.log("New entry inserted");

			 }
	 });

// listener part and one extra query:

var query = 'SELECT * FROM skin.user;';
client.query(query, function (err, qres) {
	if (err) {
		return console.log("error running query", err);
	} else {
		//console.log(qres.rows);
		//console.log(JSON.stringify(qres.rows));
	}
});

//Post request for edit entry

		client.query('UPDATE skin.entry SET rating = 5;', function(err, result) {
					 if (err) {
							 console.log(err);
					 } else {
							 console.log("Updated Entry: ");

					 }
			 });
*/

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
