var express     = require("express"),
	jwt           = require('express-jwt'),
  jstoxml       = require('jstoxml'),
  multer        = require('multer'),
  fs            = require('fs'),
  lsh           = require('../lsh'),
  middleware    = require("../middleware"),
  router        = express.Router();



//configure jwt
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

var upload = multer({ storage: storage }).single('photo');

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
      res.status(404).json(err);
      return;
    }

    if(user){
      token = user.generateJwt();
      req.logIn(user, function(err) {
        getRec(user._id);
      	if (err) { return next(err); }
      	res.status(200);
      	res.json({
        	token : token,
        	user   : user.username,
          userId : user._id,
          host: user.host,
          admin: user.admin
      	});
      });
    } else {
      // If user is not found
      console.log("User was not found");
      res.status(401).json(info);
    }
  })(req, res, next);
});

router.post("/register", function(req, res){
  //check if there is any user with same username
  User.find({username: req.body.username}, function(err, users){
    console.log(users.length);
    if(users.length !== 0){
      console.log("there is already a user")
      var _error = "This username is already in use."
      return res.status(200).json({error: _error, field: "username"});
    }
    else{
      	var newUser = new User({
      		email:  req.body.email
      	});
      	User.register(newUser, req.body.password, function(err, user){
      		if(err){
              var _error = "This email is already in use."
            	return res.status(200).json({error: _error, field: "email"});
      		}
      		user.username = req.body.username;
      		user.firstname = req.body.firstname;
      		user.lastname = req.body.lastname;
          user.image = "https://localhost:3000/static/uploads/default_avatar.png";
          user.day = req.body.day;
          user.month = req.body.month;
          user.year = req.body.year;
          user.admin = false;
          user.hostRequestSent = false;
          user.host = false;
          user.visitor = false;
      		user.save(function(err) {
      		    var token;
      		    token = user.generateJwt();
      			 passport.authenticate("local")(req, res, function(){
              var _error = "none";
      				res.status(200).json({
                token: token,
                user: user.username,
                userId: user._id, 
                host: user.host, 
                admin: user.admin, 
                error: _error
               });
      			});
      		});		
      	});
    }
   });
});

router.get("/logout", function(req, res){
	req.logout();
	res.status(200).json();
});


router.get("/users/all", auth, middleware.isAdmin, function(req,res){
  if(!req.payload._id){
      return res.status(404).json();
  }
  User.find({}, function(err, users){
     if(err){
       return res.status(404);
     }
     else{
       return res.status(200).json({data: users});
     }
  })
});

router.get("/users/host", auth, middleware.isAdmin, function(req, res){
  if(!req.payload._id){
      return res.status(404).json();
  }
  User.find({$and: [{hostRequestSent: true}, {host: false}] }, function(err, users){
    if(err){
       return res.status(404);
     }
     else{
       return res.status(200).json({data: users});
     }
  })
})

router.get('/users/xml', auth, middleware.isAdmin, function(req, res){
  if(!req.payload._id){
      return res.status(404).json();
  }
  User.find({}, { '_id': 0}).lean().exec(function(err, allUsers){
    var xml = jstoxml.toXML(allUsers, {header: true, indent: '  '});
    fs.writeFile("./public/files/users.xml", xml, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
      res.download("./public/files/users.xml");
    });
  });
});

router.get("/users/:id", function(req, res){
  var userId = req.get('userId');
  User.findById(req.params.id).populate("visited").populate("hosting").populate("Reviews").populate("recommended").exec(function(err, user){
    if(err){
      console.log(err);
    }
    else{
      // console.log("Vrike ton xristi\n" + user);
      res.status(200).json({data: user});
    }
  });
});

router.post("/users/:id/request", auth, middleware.isOwner, function(req, res){
  if(!req.payload._id){
      return res.status(404).json("error");
  }
  var userId = req.payload._id;
  User.findById(req.payload._id, function(err, user){
    if(err){
      return res.status(400).json("error");
    }
    if(userId && userId !== user._id){
      User.findById(userId, function(err, currentUser){
        if(user.city || user.city !== "undefined"){
          currentUser.searchedLocations.push(user.city);
        }
        if(user.country || user.country !== "undefined"){
          currentUser.searchedLocations.push(user.country);
        } 
        currentUser.save();
      });
    }
    user.hostRequestSent = true;
    user.save();
    console.log("at host route");
    return res.status(200).json("ok");
  });
});

router.post("/users/:id/accept", auth, middleware.isAdmin, function(req, res){
  if(!req.payload._id){
      return res.status(404).json();
  }
  User.findById(req.params.id, function(err, user){
    if(err){
      return res.status(400).json();
    }
    user.host = true;
    user.save();
    return res.status(200).json();
  });
});

router.post("/users/:id/decline", auth, middleware.isAdmin, function(req, res){
  if(!req.payload._id){
      return res.status(404).json();
  }
  User.findById(req.params.id, function(err, user){
    if(err){
      return res.status(400).json();
    }
    user.hostRequestSent = false;
    user.host = false;
    user.save();
    return res.status(200).json();
  });
});

router.put("/users/:id/edit", auth, middleware.isOwner, function(req, res){
  let id = req.params.id;
  upload(req,res,function(err) {
    var user = JSON.parse(req.body.user);
    User.findByIdAndUpdate(id, user, function(err, foundUser){
      if(err){
        console.log();
        return res.status(404);
      }
      else{
        if(req.file){
          foundUser.image =  "https://localhost:3000/static/uploads/" + req.file.filename;
        }
        foundUser.save()
        return res.json("Upload Completed for "); 
      }
    });
  });
});

router.put("/users/:id/edit/password", auth, middleware.isOwner, function(req, res){
  let id = req.params.id;
  var oldPass = req.body.password;
  var newPass = req.body.newPass;
  User.findById(id, function(err, foundUser){
    foundUser.changePassword(oldPass, newPass, function(err){
      if(err){
        console.log(err);
        return res.status(400).json(err);
      }
      else{
        foundUser.save();
        return res.status(200).json();
      }
    });
  });
});



module.exports = router;
