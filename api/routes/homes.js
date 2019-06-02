var express       = require("express"),
	  Home 	    	  = require("../models/home"),
    Users         = require("../models/user"),
    Review        = require("../models/review"),
    Comment       = require("../models/comment"),
    Matrix        = require("../models/table"),
    multer        = require('multer'),
    fs            = require('fs'),
    NodeGeocoder  = require('node-geocoder'),
    jstoxml       = require('jstoxml'),
    tableCr       = require("../create-table"),
    jwt           = require('express-jwt'),
    middleware    = require("../middleware/index"),
    router        = express.Router();


var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },                    
  filename: function (req, file, cb) {
    cb(null, file.fieldname + Date.now());
  }                     
});   

var options = {
  provider: 'google',
 
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: '', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
}; 

var geocoder = NodeGeocoder(options);

var upload = multer({ storage: storage }).array('photos', 15);


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function getMonthFromString(mon){
   return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
}

router.get("/homes", function(req, res){

  if(req.query.search !== "undefined" && req.query.guests !== "undefined"){
    var search;
    var regex = [];
    var str1 = [], str2 = [];
    var loggedUser = false;
    var userId;
    if(req.query.userId !== undefined && req.query.userId != "null"){
      userId = req.query.userId;
      loggedUser = true;
    }

    var frmtArrival;
    var frmtDeparture;
    var month1;
    var month2;
    if(req.query.arrival){
      str1 = req.query.arrival.split(' ');
      str2 = req.query.departure.split(' ');
      mon1 = getMonthFromString(str1[1]).toString();
      mon2 = getMonthFromString(str2[1]).toString();
      month1 = ("0" + mon1).slice(-2);
      month2 = ("0" + mon2).slice(-2);
      frmtArrival =   str1[3] + '-' + month1 + '-' + str1[2];
      frmtDeparture = str2[3] + '-' + month2 + '-' + str2[2];
    }
    search = req.query.search.split(',');
    var len = search.length;
    for(var i=0; i < len ; i++){
      var trimmed = search[i].trim();
      regex[i] = new RegExp(escapeRegex(trimmed), 'gi');
    }
    if(regex[0].test("all") && (search[0].length !== 0)){
      Home.find({}, function(err, allhomes){
        if(err){
          console.log(err);
         }
        else{
          res.status(200).json({data: allhomes});
        }
      });
    }
    else{
       if(search[0].length === 0){

         if(loggedUser){
            Users.findById(userId, function(err, user){
              user.searchedGuests.push(req.query.guests);
              user.save();
            });
          }

         if(!req.query.arrival){

           Home.find({guests: {$gte: req.query.guests}}, function(err, allhomes){
             if(err){
                console.log(err);
             } else {
                 res.status(200).json({data: allhomes});
             }
           }); 
         }
         else{

           Home.find({$and:[{guests: {$gte: req.query.guests}},
                   {start: {$lt: frmtArrival}},
                   {end:   {$gt: frmtDeparture}},
                   {dates: { $not: {
                      $elemMatch: { 
                        arrival : {$lt: frmtDeparture }, departure: {$gt: frmtArrival }
                      }
                   }}}
                ]}, function(err, allhomes){
             if(err){
                console.log(err);
             } else {
                 res.status(200).json({data: allhomes});
             }
           }); 
         }
       }
       else if(len === 1){

        if(loggedUser){
            Users.findById(userId, function(err, user){
              if(req.query.guests > 0){
                user.searchedGuests.push(req.query.guests);
              }
              user.searchedLocations.push(regex[0]);
              user.save();
            });
          }

         if(!req.query.arrival){

          Home.find({$and:[{ $or: [{country: regex[0]}, {city: regex[0]}, {address: regex[0]}]}, {guests: {$gte: req.query.guests}}]}, function(err, allhomes){
             if(err){
                console.log(err);
             } else {
                 res.status(200).json({data: allhomes});
             }
          }); 
        }
        else{

          Home.find({$and:[{ $or: [{country: regex[0]}, {city: regex[0]}, {address: regex[0]}]}, {guests: {$gte: req.query.guests}}, 
                    {start: {$lt: frmtArrival}},
                   {end:   {$gt: frmtDeparture}},
                   {dates: { $not: {
                      $elemMatch: { 
                        arrival : {$lt: frmtDeparture }, departure: {$gt: frmtArrival }
                      }
                   }}} ]}, function(err, allhomes){
             if(err){
                console.log(err);
             } else {
                 res.status(200).json({data: allhomes});
             }
          }); 
        }
       }
       else if(len === 2){
        if(!req.query.arrival){

          if(loggedUser){
            Users.findById(userId, function(err, user){
              if(req.query.guests > 0){
                user.searchedGuests.push(req.query.guests);
              }
              user.searchedLocations.push(regex[0]);
              user.searchedLocations.push(regex[1]);
              user.save();
            });
          }

          Home.find({$and:[{ $or: [{ $and: [{country: regex[0]}, {$or: [{city: regex[1]}, {address: regex[1]}   ]} ] },
                                 { $and: [{city: regex[0]},    {$or: [{country: regex[1]}, {address: regex[1]}]} ] },
                                 { $and: [{address: regex[0]}, {$or: [{country: regex[1]}, {city: regex[1]}   ]} ] }
                                ] },
                   {guests: {$gte: req.query.guests}}]}, function(err, allhomes){
             if(err){
                console.log(err);
             } else {
                 res.status(200).json({data: allhomes});
             }
         }); 
        }
        else{

          Home.find({$and:[{ $or: [{ $and: [{country: regex[0]}, {$or: [{city: regex[1]}, {address: regex[1]}   ]} ] },
                                 { $and: [{city: regex[0]},    {$or: [{country: regex[1]}, {address: regex[1]}]} ] },
                                 { $and: [{address: regex[0]}, {$or: [{country: regex[1]}, {city: regex[1]}   ]} ] }
                                ] },
                   {guests: {$gte: req.query.guests}},
                   {start: {$lt: frmtArrival}},
                   {end:   {$gt: frmtDeparture}},
                   {dates: { $not: {
                      $elemMatch: { 
                        arrival : {$lt: frmtDeparture }, departure: {$gt: frmtArrival }
                      }
                   }}}
                   ]}, function(err, allhomes){
             if(err){
                console.log(err);
             } else {
                 res.status(200).json({data: allhomes});
             }
         }); 
        }
      }
      else if(len === 3){
        if(!req.query.arrival){

        if(loggedUser){
            Users.findById(userId, function(err, user){
              if(req.query.guests > 0){
                user.searchedGuests.push(req.query.guests);
              }
              user.searchedLocations.push(regex[0]);
              user.searchedLocations.push(regex[1]);
              user.searchedLocations.push(regex[2]);
              user.save();
            });
          }

         Home.find({$and:[{ $or: [{ $and: [{country: regex[0]}, {$or: [{ $and: [{city: regex[1]},    {address: regex[2]}] }, { $and: [{address: regex[1], city: regex[2]   }]} ]} ] },
                                  { $and: [{city:    regex[0]}, {$or: [{ $and: [{country: regex[1]}, {address: regex[2]}] }, { $and: [{address: regex[1], country: regex[2]}]} ]} ] },
                                  { $and: [{address: regex[0]}, {$or: [{ $and: [{country: regex[1]}, {city:    regex[2]}] }, { $and: [{city: regex[1],    country: regex[2]}]} ]} ] },
                                ] },
                   {guests: {$gte: req.query.guests}},
                   ]}, function(err, allhomes){
             if(err){
                console.log(err);
             } else {
                 res.status(200).json({data: allhomes});
             }
        }); 
       } 
        else{

          Home.find({$and:[{ $or: [{ $and: [{country: regex[0]}, {$or: [{ $and: [{city: regex[1]},    {address: regex[2]}] }, { $and: [{address: regex[1], city: regex[2]   }]} ]} ] },
                                    { $and: [{city:    regex[0]}, {$or: [{ $and: [{country: regex[1]}, {address: regex[2]}] }, { $and: [{address: regex[1], country: regex[2]}]} ]} ] },
                                    { $and: [{address: regex[0]}, {$or: [{ $and: [{country: regex[1]}, {city:    regex[2]}] }, { $and: [{city: regex[1],    country: regex[2]}]} ]} ] },
                                  ] },
                     {guests: {$gte: req.query.guests}},
                     {start: {$lt: frmtArrival}},
                      {end:   {$gt: frmtDeparture}},
                     {dates: { $not: {
                        $elemMatch: { 
                          arrival : {$lt: frmtDeparture }, departure: {$gt: frmtArrival }
                        }
                     }}}
                     ]}, function(err, allhomes){
               if(err){
                  console.log(err);
               } else {
                   res.status(200).json({data: allhomes});
               }
          }); 
        }
      }
    }
  }
  else{
    Home.find({}, function(err, allhomes){
       if(err){
           console.log(err);
       }
       else{
           res.status(200).json({data: allhomes});   
       }
    });
  }  
});

router.get('/homes/xml', auth, middleware.isAdmin, function(req, res){
    Home.find({},{ '_id': 0}).lean().exec(function (err, allHomes) {
      var xml = jstoxml.toXML(allHomes,{header: true, indent: '  '});
      fs.writeFile("./public/files/homes.xml", xml, function(err) {
        if(err) {
            console.log(err);
        }else{
          res.download("./public/files/homes.xml");
        }
      });
  });
});


router.post("/homes/:id/book", auth, function(req, res){
  Home.findById(req.params.id, function(err, home){
    if(err){
      console.log(err);
      return res.status(404);
    }
    else{
      let arrival = req.body.arrival;
      let departure = req.body.arrival;
      let guests = req.body.guests;
      str1 = req.body.arrival.split(' ');
      str2 = req.body.departure.split(' ');
      mon1 = getMonthFromString(str1[1]).toString();
      mon2 = getMonthFromString(str2[1]).toString();
      month1 = ("0" + mon1).slice(-2);
      month2 = ("0" + mon2).slice(-2);
      frmtArrival =   str1[3] + '-' + month1 + '-' + str1[2];
      frmtDeparture = str2[3] + '-' + month2 + '-' + str2[2];
      home.dates.push({arrival: frmtArrival, departure: frmtDeparture});
      home.save();
      User.findById(req.payload._id, function(err, user){
        if(err){
          console.log(err);
          return res.status(404);
        }
        if(user.visitor === false || user.visitor === undefined){
          user.visitor = true;
        }
        var index = user.visited.indexOf(home._id);
        if(index <= -1){
            user.visited.push(home);
        }
        user.save();
      })
      return res.status(200).json();
    }
  });
});

router.get("/homes/:id", function(req, res){
  var userId = req.get('userId');

  Home.findById(req.params.id).populate("Comments").populate("Reviews").exec(function(err, home){
    if(err){
      console.log(err);
      return res.status(404).json();
    }
    else{
      if(userId){
        Users.findById(userId, function(err, user){
          user.housesViewed.push(home);
          user.searchedLocations.push(home.city);
          user.searchedLocations.push(home.country);
          user.searchedGuests.push(home.guests);
          user.save();
        });
      }
      res.status(200).json({data: home});

    }
  });
});

router.put('/homes/:id/edit', auth, middleware.isHomeHost, function(req,res){
   var authHeader = req.get('Authorization');
   var token = authHeader.slice(7);
   var homeId = req.params.id;
    if(!req.payload._id){
      return res.sendStatus(404);
    }
    upload(req,res,function(err) {
      var house = JSON.parse(req.body.home);
      var toRemove = JSON.parse(req.body.toremove);
      User.findById(req.payload._id, function(err, found){
        if(err){
          console.log(error);
          return res.sendStatus(400);
        }

        Home.findByIdAndUpdate(homeId, house, function(err, home){
          var photos = req.files.length;
          var firstPhotoRemoved = false;

          str1 = house.start.split(' ');
          str2 = house.end.split(' ');
          mon1 = getMonthFromString(str1[1]).toString();
          mon2 = getMonthFromString(str2[1]).toString();
          month1 = ("0" + mon1).slice(-2);
          month2 = ("0" + mon2).slice(-2);
          home.start =   str1[3] + '-' + month1 + '-' + str1[2];
          home.end = str2[3] + '-' + month2 + '-' + str2[2];
          geocoder.geocode({address: home.address, country: home.country, zipcode: home.zip_code}, function(err, result) {
              if(err || result[0] === undefined) {
                return res.sendStatus(404);
              }
              home.latitude = result[0].latitude;
              home.longitude = result[0].longitude;
              home.save();     
            });
          for(var i = 0 ; i < toRemove.length ; i++){
            if(home.image === toRemove[i]){
              var filename = home.image.replace("https://localhost:3000/static/uploads/", "");
              var path = "./public/uploads/" + filename;
              fs.unlink(path)
              home.image = "";
              firstPhotoRemoved = true;
            }else{
              var index = home.pictures.indexOf(toRemove[i]);
              if (index > -1) {
                   var filename = home.pictures[index].replace("https://localhost:3000/static/uploads/", "");
                   var path = "./public/uploads/" + filename;
                   home.pictures.splice(index, 1);
                   fs.unlink(path)
              }
            }
          }
          if(photos > 0){
             if(firstPhotoRemoved){
              home.image = "https://localhost:3000/static/uploads/" + req.files[0].filename;
              for(var i=1 ; i<photos ; i++){
                home.pictures.push("https://localhost:3000/static/uploads/" + req.files[i].filename);
              }
            }else{
              for(var i=0 ; i<photos ; i++){
                home.pictures.push("https://localhost:3000/static/uploads/" + req.files[i].filename);
              }
            }
          }
          home.save();
                // return res.sendStatus(200);
          return res.json("Upload Completed"); 
        });
      });
    });
     
});

router.post('/homes/:id/comments', auth, function(req, res){
  if(!req.payload._id){
     return res.status(404).json();
  }
  var userId = req.payload._id;
  var homeId = req.params.id;
  Home.findById(homeId, function(err, home){
     var comment = new Comment();
     comment.text = req.body.text;
     Comment.create(comment, function(err, comment){
          if(err){
              console.log(err);
              return res.status(404).json();
          }
          else{
              comment.author.id = userId;
              User.findById(userId, function(err, user){
                comment.author.username = user.username;
                comment.save();
                console.log(comment.author.username);
              });
              home.Comments.push(comment);
              home.save();
              console.log("success");
              return res.send(200).json();
          }
      });
  });
});

router.put('/homes/:id/comments/:comment', auth, middleware.isAuthor, function(req, res){
  if(!req.payload._id){
      return res.status(404).json();
  }
  var userId = req.payload._id;
  var homeId = req.params.id;
  var commentId = req.params.comment;
  Home.findById(homeId, function(err, home){
     Comment.findByIdAndUpdate(commentId, req.body.comment, function(err, comment){
          if(err){
              console.log(err);
              res.status(404);
          }
          else{
              res.send(200).json();
          }
      });
  });
});

router.delete('/homes/:id/comments/:comment', auth, middleware.isAuthor, function(req, res){
  var userId = req.payload._id;
  var homeId = req.params.id;
  var commentId = req.params.comment;
  Home.findById(homeId, function(err, home){
     var index = home.Comments.indexOf(homeId);
     if(index > -1){
      home.comments.splice(index, 1);
     }
     Comment.findByIdAndRemove(commentId, function(err, comment){
          if(err){
              console.log(err);
              return res.status(404);
          }
          else{
              return res.send(200).json();
          }
      });
  });
});

router.post('/homes/:id/rate', auth, function(req, res){
  var userId = req.payload._id;
  var homeId = req.params.id;
  Home.findById(homeId, function(err, home){
      if(err){
        return res.sendStatus(404);
      }
      else{
        review = new Review();
        review.text = req.body.review;
        review.rating = req.body.rating;
        Review.create(review, function(err, review){
          if(err){
              console.log(err);
              return res.send(404);
          }
          else{
            User.findById(userId, function(err, user){
              if(err){
                return res.send(404);
              }
              else{
                review.home.id = home._id;
                review.home.name = home.name;
                review.author.id = user._id;
                review.author.username = user.username;
                home.Reviews.push(review);
                user.Reviews.push(review);
                home.save();
                review.save();
                user.save();
                return res.send(200).json();
              }
            })
          }
        });
        }
  });
});


router.post('/homes/new', auth, middleware.isHost, function(req,res){
   let authHeader = req.get('Authorization');
   let token = authHeader.slice(7);
    upload(req,res,function(err) {
      var home = JSON.parse(req.body.home);
      User.findById(req.payload._id, function(err, found){
        if(err){
          console.log(error);
          // return res.send(400);
        }
        Home.create(home, function(err, newlyCreated){
          str1 = newlyCreated.start.split(' ');
          str2 = newlyCreated.end.split(' ');
          mon1 = getMonthFromString(str1[1]).toString();
          mon2 = getMonthFromString(str2[1]).toString();
          month1 = ("0" + mon1).slice(-2);
          month2 = ("0" + mon2).slice(-2);
          newlyCreated.start =   str1[3] + '-' + month1 + '-' + str1[2];
          newlyCreated.end = str2[3] + '-' + month2 + '-' + str2[2];
          geocoder.geocode({address: newlyCreated.address, country: newlyCreated.country, zipcode: newlyCreated.zip_code}, function(err, result) {
              if(err || result[0] === undefined) {
                newlyCreated.remove();
                return res.status(404).send("error");
              }
              else{
                newlyCreated.latitude = result[0].latitude;
                newlyCreated.longitude = result[0].longitude;
                newlyCreated.dates = [];
                newlyCreated.save();
                var photos = req.files.length;
                newlyCreated.image = "https://localhost:3000/static/uploads/" + req.files[0].filename;
                for(var i=1 ; i<photos ; i++){
                  newlyCreated.pictures.push("https://localhost:3000/static/uploads/" + req.files[i].filename);
                }
                newlyCreated.Host = {
                  id: found._id,
                  username: found.username
                }
                newlyCreated.save();
                found.hosting.push(newlyCreated);
                found.save();
                Matrix.remove({}, function(err){
                 if(err){
                   console.log(err);
                 }
                 else{
                   tableCr();
                  return res.json("Upload Completed "); 
                 }
                });
                // return res.json("Upload Completed "); 

              }        
            });
        });
      });
    });
     
});

module.exports = router;