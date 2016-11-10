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
 * Post-Rquisite: JSON object will be returned no change in database
 */
 exports.getUsers = function(req,res,next){
   // Check if the request has no query in it
   var query = req.query;
   if(Object.keys(query).length == 0){
    //  var string = "SELECT * FROM skin.user;";
    //  var rows = queryGetDatabase(string,"Get users");
    //  res.json(rows);
    client.query("SELECT * FROM skin.user",function(err,qres){
      console.log(qres.rows);
      console.log(qres);
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
  client.query("INSERT INTO skin.user (username,password,email) VALUES($1::text,$2::text,$3::text)",
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
 exports.getProducts = function(req,res,next){
   //Check if there is no query
   var query = req.query;
   if(Object.keys(query).length == 0){
     var string = "SELECT * FROM skin.product;" ;
     var rows = queryGetDatabase(string,"Get Products");
     res.json(rows);
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
     var string = "SELECT * FROM skin.product WHERE ID=" + query.prodid + ";";
     var rows = queryGetDatabase(string, "Get Product By ID");
     res.json(rows);
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
     var string = "SELECT * FROM skin.product WHERE brand=" + query.brand + ";";
     var rows = queryGetDatabase(string,"Get Products By Brand");
     res.json(rows);
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
    if(query.userid != ''){
      var string = "SELECT * FROM skin.myproduct WHERE userID=" + query.userid + ";";
      var rows = queryGetDatabase(string, "Get User Products");
      res.json(rows);
    }
    else{
      //This is the last in the chain so there is no next
      req.send("Error");
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
    client.query('INSERT INTO skin.product VALUES (DEFAULT, $1, $2)', [name, brand],
        function(err,qres){
          if(err){
            //Err is a map return the error to the user
            return res.send("Error\n");
          }
          else{
            res.send("Success\n");
          }
        });

  }