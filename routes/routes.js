var uuidV4 = require('uuid/v4');
var path = require('path');
var fs = require('fs');

/* Wrapper function to query a GET request into the database
 */
function queryGetDatabase(string,method){
  client.query(string,function(err,qres){
    if(err){
      //Handle Error with a function
      console.log("Error in " + method);
    }
    else{
      return qres.rows;
    }
  });
}

/* Function that queries our database for all the users
 * returns them
 * Pre-Requisite: client must be the global variable that holds
 * our PostgreSQL database instance
 * Post-Requisite: JSON object will be returned no change in database
 */
 exports.getUsers = function(req,res,next){
   // Check if the request has no query in it
   var query = req.query;
   if(Object.keys(query).length == 0){
    //  var string = "SELECT * FROM skin.user;";
    //  var rows = queryGetDatabase(string,"Get users");
    //  res.json(rows);
    client.query("SELECT * FROM skin.user",function(err,qres) {
      res.json(qres.rows);
    });
   }
   else{
     return next();
   }

}

/* Handler to query database to find a specific user
 *
 *
 */
exports.getUsersByName = function(req,res,next){
  //Check if the request query has username
  if(req.query.username != ''){
    var username = req.query.username;
    //Query database
    var string = "SELECT * FROM skin.user WHERE username =" + username  + ";";
    var rows = queryGetDatabase(string, "Get User By Name");
    res.json(rows);
  }
  else{
    return next();
  }
}

/* Handler function to get a user by email
 *
 */
exports.getByEmail = function(req,res,next){
  //Check if the request has email in the query
  if(req.query.email != ''){
    //Add validation Checks
    var email = req.query.email;
    //Query database
    var string = "SELECT * FROM skin.user WHERE email="+email + ";";
    var rows = queryGetDatabase(string, "Get By Email");
    res.json(rows);
  }
  else{
    res.send('Error');
  }
}

exports.getUserByNamePassword = function(req,res,next){
  if (req.query.username != "" && req.query.password != ""){
    var username = req.query.username;
    var password = req.query.password;
    client.query("SELECT * FROM skin.user where username=" + username + " and password=" + password,function(err,qres){
      res.json(qres.rows);
    });
   }
   else{
     return next();
   }

}



/* Function that adds a new user into our database
 *
 */
exports.postUser = function(req,res,next){
  var body = req.body;
  // Get the required fields
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  //perform the validation checks
  // Query Database
  client.query("INSERT INTO skin.user (username,password,email) VALUES($1, $2, $3)",
        [username,password,email],
      function(err,qres){
        if(err){
          //Err is a map return the error to the user
          return res.send("Duplicate Key Value\n");
        }
        else{
          res.send("Success\n");
        }
      });
}

/*
 *
 */
 exports.getEntriesByUserID = function(req, res, next){
   if (req.query.userID != ""){
     var id = req.query.userID;
     client.query("SELECT * FROM skin.entry where userid=" + id + "ORDER BY date DESC",function(err,qres){
       res.json(qres.rows);
     });
    }
    else{
      return next();
    }

 }

exports.getEntryByEntryID = function(req,res,next){
  //This queries the database and returns the rows from the database
 	//TimeStamp entryDate = '2016-11-09 17:55:20.268058';
  if (req.query.entryID != ""){
    var id = req.query.entryID;
    client.query('SELECT * FROM skin.entry WHERE id = $1', [id], function(err, result) {
      if (err) {
          console.log(err);
      } else {
          res.json(result.rows);
      }
    });
  }
  else {
    res.send('Error');
  }
}

// Save photo for new entry to the file system. Doesn't work with heroku
/*exports.addEntryWithPhoto = function(req, res, next){
  console.log("got to add entry with photo");
  if (req.body.photo != '') {
    console.log("Adding entry with photo.");
    var body = req.body;
    var date = body.date;
    var userID = body.userID;
    var entryDescription = body.entryDescription;
    var rating = body.rating;
    var photoData = body.photo.replace(/^data:image\/\w+;base64,/, '');
    var photoName = uuidV4() + '.jpg'

    fs.writeFile(path.resolve(__dirname, '../photos/') + '/' + photoName,
          photoData, 'base64', function(err){
      if (err) {
        console.log('Error uploading photo to server: ' + err);
      } else {
        console.log('Photo saved to server.');
        client.query('INSERT INTO skin.entry (userID, description, rating, date, photoLocation) VALUES ($1, $2, $3, $4, $5)',
        [userID, entryDescription, rating, date, photoName], function(err, result) {
          if (err) {
            console.log("Error inserting entry with photo: " + err);
          } else {
            console.log("Inserted new entry with photo.");
          }
        });
      }
    });
  } else {
    return next();
  }
}*/

exports.addEntryWithPhoto = function(req, res, next){
  console.log("got to add entry with photo");
  if (req.body.photo != '') {
    console.log("Adding entry with photo.");
    var body = req.body;
    var date = body.date;
    var userID = body.userID;
    var entryDescription = body.entryDescription;
    var rating = body.rating;
    var photoData = body.photo;

    //console.log('to string: ' + photoData.toString());
    client.query('INSERT INTO skin.entry (userID, description, rating, date, photoLocation) VALUES ($1, $2, $3, $4, $5)',
    [userID, entryDescription, rating, date, photoData], function(err, result) {
      if (err) {
        console.log("Error inserting entry with photo: " + err);
      } else {
        console.log("Inserted new entry with photo.");
      }
    });
  } else {
    return next();
  }
}

exports.addEntry = function(req, res, next){
  console.log('got to addEntry');
  if (req.body.photo == '') {
    var body = req.body;
    var date = body.date;
    var userID = body.userID;
    var entryDescription = body.entryDescription;
    var rating = body.rating;
    console.log("Adding entry without photo");
    client.query('INSERT INTO skin.entry (userID, description, rating, date) VALUES ($1, $2, $3, $4)',
        [userID, entryDescription, rating, date], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        console.log("Inserted new entry without photo.");
      }
    });
  } else {
    return next();
  }
}

 exports.editEntry = function(req, res, next) {

    var body = req.body;
    var entryID = body.entryID;
    var userID = body.userID;
    var date = body.date;
    var photoLocation = body.photoLocation;
    var entryDescription = body.entryDescription;
    var rating = body.rating;

    console.log(entryID);
    console.log(userID);
    console.log(date);


		client.query('UPDATE skin.entry SET date=$1, photoLocation=$2,description=$3,rating=$4 WHERE ID=$5 and userID=$6',
    [date,photoLocation,entryDescription,rating,entryID,userID]
        , function(err, result) {
					 if (err) {
                console.log("GOT HERE BUT IT SHOULDNT'T");
							  console.log(err);
					 } else {
							 console.log("Updated Entry: " + entryID);

					 }
			 });
  }

  exports.deleteEntry = function(req,res,next){

    var body = req.body;
    var entryID = body.entryID;
    var userID = body.userID;
    //perform the validation checks
    // Query Database
    client.query("DELETE FROM skin.entry WHERE entryid=$1::text and userid=$2::text;",
          [entryID,userID],
        function(err,qres){
          if(err){
            //Err is a map return the error to the user
            return res.send("Duplicate Key Value\n");
          }
          else{
            res.send("Success\n");
          }
        });
  };

 exports.getProducts = function(req,res,next){
   //Check if there is no query
   var query = req.query;
   if(Object.keys(query).length == 0){
     /*var string = "SELECT * FROM skin.product";
     var rows = queryGetDatabase(string,"Get Products");
     res.json(rows);*/
     client.query("SELECT * FROM skin.product", function(err,qres){
       if(err) {
         console.log("Error in Get Products");
       }
       else{
         res.json(qres.rows);
       }
     });
   }
   else{
     return next();
   }
 }

 /* Handler function that queries the database and returns the product by
  *
  */
 exports.getProductById = function(req,res,next){
   //Check if we have the prod id query
   var query = req.query;
   if(query.prodid != ''){
     /*var string = "SELECT * FROM skin.product WHERE ID=" + query.prodid + ";";
     var rows = queryGetDatabase(string, "Get Product By ID");
     res.json(rows);*/
     client.query("SELECT * FROM skin.product WHERE ID=" + query.prodid, function(err,qres){
       if(err) {
         console.log("Error in Get Product By ID");
       }
       else{
         res.json(qres.rows);
       }
     });
   }
   else{
     return next();
   }
 }

 /* Handler function that queries the database and returns all the products
  * by brand
  */
 exports.getProductsByBrand = function(req,res,next){
   //Check if the desired query is there
   var query = req.query;
   if(query.brand != ''){
     /*var string = "SELECT * FROM skin.product WHERE brand=" + query.brand + ";";
     var rows = queryGetDatabase(string,"Get Products By Brand");
     res.json(rows);*/
     client.query("SELECT * FROM skin.product WHERE brand=" + query.brand, function(err,qres){
       if(err) {
         console.log("Error in " + "Get Product By ID");
       }
       else{
         res.json(qres.rows);
       }
     });
   }
   else{
     return next();
   }
 }

 /*
  *
  */
  exports.getProductsByRating = function(req,res,next){
    var query = req.query;
    if(query.rating != ''){
      var ratingInt = parseInt(query.rating);
      var string = "SELECT * FROM skin.productreview WHERE rating=" + ratingInt + ";";
      var rows = queryGetDatabase(string, "Get Products By Rating");
      res.json(rows);
    }
    else{
      return next();
    }
  }

  /*
   *
   */
  exports.getUserProducts = function(req,res,next){
    var query = req.query;
    console.log(query.userID);
    if(query.userID != ''){
      client.query("SELECT * FROM skin.product WHERE userID=" + query.userID + ";", function(err, qres) {
        if (err) {
          res.send("Error, getUserProducts query failed");
        } else {
          res.json(qres.rows);
        }
      });
    } else {
      res.send("Error, no userID provided in getUserProducts");
    }
  }

  exports.getProductsByEntry = function(req, res, next) {
    var entryID = req.query.entryID;
    console.log(entryID);
    if (entryID != '') {
      client.query("SELECT * FROM skin.productUsed WHERE entryID = " + entryID, function(err, qres) {
        if (err) {
          res.send("Error, getProductsByEntry query failed");
        } else {
          res.json(qres.rows);
        }
      });
    } else {
      res.send("Error, no entryID provided in getProductsByEntry");
      return next();
    }
  }

  /*
   *
   */
  exports.addProduct = function(req,res,next){
    //TODO: TO be completed

    var body = req.body;
    var name = body.name;
    var brand = body.brand;
    var userid = body.userid;
    var expirydate = body.expirydate;
    client.query("INSERT INTO skin.product (name, brand, userid, expirydate) VALUES ($1, $2, $3, $4)",
    [name, brand, userid, expirydate],
        function(err,qres){
          if(err){
            //Err is a map return the error to the user
            return res.send("Error with addProduct \n");
          }
          else{
            console.log("New product added to product\n");
            return req.body;
          }
        });
  }

  exports.getEntriesByIssue = function(req,res, next){
    var body = req.body;
    var userID = body.userID;
    var issue = body.issue;
    //
    var queryToGo = "SELECT * FROM skin.MyIssue, skin.IssueTagged, skin.Entry" +
    "where  skin.MyIssue.name =" + issue +
    "and skin.IssueTagged.entryID = skin.MyIssue.ID" +
    "and skin.Entry.ID = Skin.IssueTagged.entryID;"
    client.query(queryToGo, function(err,qres){
       if(err) {
         console.log("Error in get entries by Issue");
       }
       else{
         res.json(qres.rows);
       }
     });
  }

  //we should also have a get entries by products used
  exports.getEntriesByProductUsed = function(req,res, next){
    var body = req.body;
    var userID = body.userID;
    var product = body.product;
    var queryToGo = "SELECT * FROM skin.Entry, skin.Product"
    + "where skin.Product.name =" + product +
    "and skin.Product.ID = skin.Entry.ID;"
    client.query(queryToGo, function(err,qres){
       if(err) {
         console.log("Error in get entries by Product");
       }
       else{
         res.json(qres.rows);
       }
     });
  }

  /* Function that gets average rating for entries in a given date interval
   * pre req:
   * post-req:
   */
  exports.avgEntries = function(req,res,next){

  }

  exports.uploadPhoto = function(req,res,next){
    fs.writeFile('test-photo', req.body, function(err){
        if (err) throw err
        console.log('File saved.')
    });
  }

exports.getPhoto = function(req,res, next){
  if (req.query.name != "") {
    res.sendFile(path.resolve(__dirname, '../photos/') + '/' + req.query.name);
  }
}

exports.getAvgRating = function(req, res, next) {
  if (req.query.userID != "" && req.query.year != "") {
    var id1 = req.query.userID;
    var id2 = req.query.year;
    var queryToGo = "SELECT AVG(rating) as rating, to_char(date, 'Mon') as month From Skin.Entry Where userid=" + id1 + " AND to_char(date, 'YYYY')=" + id2 + "Group  by userId, month ORDER BY userId, month DESC";
    client.query(queryToGo, function(err, qres) {
      if(err) {
        console.log("Error in getting avg ratings for entries");
      }
      else{
        res.json(qres.rows);
      }
    })
  }

}

exports.getMaxRating = function(req, res, next) {
  if (req.query.userID != "") {
    var id = req.query.userID;
    var queryToGo = "SELECT MAX(Skin.ProductUsed.rating), to_char(date, 'Mon-YYYY') as month" +
    "FROM Skin.Entry, Skin.ProductUsed, Skin.Product WHERE Skin.Entry.id = Skin.ProductUsed.entryID AND Skin.Product.id = Skin.productused.productid AND Skin.entry.userid=" + id +
    "GROUP BY Skin.entry.userid, month" +
    "ORDER BY Skin.entry.userid, month DESC";
    client.query(queryToGo, function(err, qres) {
      if(err) {
        console.log("Error in getting max ratings for entries");
      }
      else{
        res.json(qres.rows);
      }
    })
  } else {
    var queryToGo = "SELECT Skin.product.name as Product, MAX(Skin.ProductUsed.rating), to_char(date, 'Mon-YYYY') as month" +
    "FROM Skin.Product, Skin.Entry, Skin.ProductUsed WHERE Skin.Entry.id = Skin.ProductUsed.entryID AND Skin.product.id = Skin.productused.productId" +
    "GROUP BY product, month" +
    "ORDER BY product, month DESC";
    client.query(queryToGo, function(err, qres) {
      if(err) {
        console.log("Error in getting max ratings for entries");
      }
      else{
        res.json(qres.rows);
      }
    })
  }
}

exports.getYearsFromEntries = function(req, res, next) {
  if (req.query.userID != "") {
    var id = req.query.userID;
    var querytoGo = "SELECT DISTINCT to_char(date, 'YYYY') as year FROM Skin.entry WHERE userid=" + id + " ORDER BY year DESC;";
    client.query(querytoGo, function(err, qres) {
      if(err) {
        console.log("Error in getting max ratings for entries");
      }
      else{
        res.json(qres.rows);
      }
    })
  }
}

/** Returns the 5 products with the greatest number of ratings overall
 * @param none
 * returns:[{name:m, brand:b, total_rating:r}]
 */
/*exports.getMaxProducts = function(req,res,next){
  // If the request has a startdate query pass it over
  if(typeof req.query.startdate == "undefined"){
    return next();
  }
  var queryCons = "SELECT * FROM (SELECT s.ID as ID, s.name as name, s.brand " +
  "as brand, sum(b.rating) as total_rating FROM Skin.product s INNER JOIN " +
  " Skin.ProductUsed b ON s.ID = b.productID GROUP BY s.ID) AS yes order by " +
  "yes.total_rating desc LIMIT 5;";

  var rows = queryGetDatabase(queryCons,"getMaxProducts");
  res.json(rows);
}*/

/** Returns the top 5 performing products overall within the date range
 * @param query must contain 2 dates in the form yyyy-mm-dd. startdate and enddate
 * ?startdate=2016-11-12
 *
 */
/*exports.maxProductByRange = function(req,res,next){
  // Get ranges
  var startdate = req.query.startdate;
  var enddate = req.query.enddate;

  var queryCons = "SELECT * FROM (SELECT s.ID as ID, s.name as name, s.brand " +
  "as brand, sum(b.rating) as total_rating FROM Skin.product s INNER JOIN " +
  " Skin.ProductUsed b ON s.ID = b.productID GROUP BY s.ID where to_date(" + startdate + ",YYYY-MM-DD) <= now()) AS yes order by " +
  "yes.total_rating  LIMIT 5;";

  var rows = queryGetDatabase(queryCons,"getMaxProducts");
  res.json(rows);
}*/

/**TODO: AFTER TESTING FRONT END
 * @param userId should pass as param
 * Returns the maximum rated product per user in the whole lifespan. Not per entry
 */
/*exports.maxProductByUser = function(req,res,next){
  // CHeck if it is undefined
  if(typeof req.query.startdate != "undefined"){
    return next();
  }

  var userid = req.param.userid;
  var queryCons = "SELECT * FROM (SELECT s.ID as ID, s.name as name, s.brand " +
  "as brand, sum(b.rating) as total_rating FROM Skin.product s INNER JOIN " +
  " Skin.ProductUsed b ON s.ID = b.productID GROUP BY s.ID where b.id =" + userid" ) AS yes order by " +
  "yes.total_rating desc LIMIT 5;";
  console.log(queryCons);

  var rows = queryGetDatabase(queryCons, "maxProductByUser");
  res.json(rows);
}*/

/** TODO: AFTER TESTING FRONT END
 *
 */
/*exports.maxProductUserRange = function(req,res,next){

}*/

/**
 * Get the overall minimum product of our system
 * Five chosen products
 */
/*exports.getMinProduct = function(req,res,next){
  // If the request has a startdate query pass it over
  if(typeof req.query.startdate == "undefined"){
    return next();
  }
  var queryCons = "SELECT * FROM (SELECT s.ID as ID, s.name as name, s.brand " +
  "as brand, sum(b.rating) as total_rating FROM Skin.product s INNER JOIN " +
  " Skin.ProductUsed b ON s.ID = b.productID GROUP BY s.ID) AS yes order by " +
  "yes.total_rating  LIMIT 5;";

  var rows = queryGetDatabase(queryCons,"getMaxProducts");
  res.json(rows);
}*/

/*exports.minProductByRange = function(req, res, next){
  //
}*/

/**
 * Returns five lowest rated products per user
 * @param must have userid if in the query startdate is defined next function
 */
/*exports.minProductUser = functon(req,res,next){
  if(typeof req.query.startdate != "undefined"){
    return next();
  }

  var userid = req.param.userid;
  var queryCons = "SELECT * FROM (SELECT s.ID as ID, s.name as name, s.brand " +
  "as brand, sum(b.rating) as total_rating FROM Skin.product s INNER JOIN " +
  " Skin.ProductUsed b ON s.ID = b.productID GROUP BY s.ID where b.id =" + userid" ) AS yes order by " +
  "yes.total_rating LIMIT 5;";
  var rows = queryGetDatabase(queryCons, "minProductUser");
  res.json(rows);
}*/

/**TODO: AFTER TESTING FRONT END
 *
 */
/*exports.minProductByRangeUser = functon(req,res,next){

}*/

exports.getCurrentEntry = function(req, res, next) {

  var userID = req.query.entryID;
  var date = req.query.date;
  console.log(entryID);
  console.log(date);
  if (entryID != '' || date != '') {
    client.query("SELECT * FROM skin.entry WHERE id = " + entryID
    + " AND date = " + date, function(err, qres) {
      if (err) {
        res.send("Error, getCurrentEntry query failed");
      } else {
        res.json(qres.rows);
      }
    });
  } else {
    res.send("Error, no entryID provided in getProductsByEntry");
    return next();
  }

}
