var http = require('http');
var fs = require('fs');
var pg = require('pg');
var express = require('express');
var app = express();

// Establish database connection
pg.defaults.ssl = true; //always keep true!!!
var conString = "postgres://ziopwikywoanoj:yO-w-jpnxex5OKPQXLJE0sjgC6@ec2-54-225-64-254.compute-1.amazonaws.com:5432/d9mma6e753ienl"
client = new pg.Client(conString);
client.connect(function(err) {
	//error
	if (err) {
		return console.error('could not connect to postgres', err);
	}
});

/*app.get('/entry/:userID/:date', function(req, res) {

    //This queries the database and returns the rows from the database
	Integer id = req.queryParams("userID");
	TimeStamp entryDate = req.queryParams("date");
	client.query("SELECT * FROM skin.entry WHERE userID ="+ id +"and date ="+ entryDate +";", function (err, qres) {
		if (err) {
			console.log("error");
		} else {
			console.log(qres.rows);
			res.json(qres.rows);
		}
	});

});*/

app.post('/add-entry', function(req, res) {
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

var listener = app.listen(process.env.PORT || 3000, function () {
	console.log('Server running on port ' + listener.address().port);
});
