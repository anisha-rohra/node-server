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
     client.query("SELECT * FROM skin.user;", function (err, qres) {
       if (err) {
         console.log("error");
       } else {
         console.log(qres.rows);
         res.json(qres.rows);
       }
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
    client.query("SELECT * FROM skin.user WHERE username=$1::text",[username],
            function(err,qres){
              if(err) console.log("error");
              else{
                res.json(qres.rows);
              }
            });
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
    client.query("SELECT * FROM skin.user WHERE email=$1::text",[email],
            function(err,qres){
              if(err) console.log("error");
              else{
                res.json(qres.rows);
              }
            });
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
