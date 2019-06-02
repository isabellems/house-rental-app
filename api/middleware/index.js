var Home = require("../models/home"),
    User    = require("../models/user"),
    Comment = require("../models/comment");


var middlewareObj = {};

middlewareObj.isAdmin = function(req, res, next){
  var id = req.payload._id;
  User.findById(id, function(err, user){
  	if(err){
  		return res.status(404).json();
  	}
  	else if(user.admin){
  		return next();
  	}
  	else{
  	   return res.status(404).json();
  	}
  });
}

middlewareObj.isHomeHost = function(req, res, next){
  var id = req.payload._id;
  Home.findById(req.params.id, function(err, home){
  	if(err){
  		return res.status(404).json();
  	}
  	else if(home.Host.id == id){
  		return next();
  	}
  	else{
  		console.log("here");
  		console.log(home.Host.id);
  		console.log(id);
  	   return res.status(404).json();
  	}
  });	
}

middlewareObj.isOwner = function(req, res, next){
  var id = req.payload._id;
  User.findById(req.params.id, function(err, user){
  	if(err){
  		return res.status(404).json();
  	}
  	else if(user.id == id){
  		return next();
  	}
  	else{
  	   return res.status(404).json();
  	}
  });	
}

middlewareObj.isAuthor = function(req, res, next){
  var id = req.payload._id;
  Comment.findById(req.params.comment, function(err, comment){
  	if(err){
  		return res.status(404).json();
  	}
  	else if(comment.author.id == id){
  		return next();
  	}
  	else{
  	   return res.status(404).json();
  	}
  });	
}

middlewareObj.isHost = function(req, res, next){
  var id = req.payload._id;
  User.findById(id, function(err, user){
  	if(err){
  		return res.status(404).json();
  	}
  	else if(user.host){
  		return next();
  	}
  	else{
  	   return res.status(404).json();
  	}
  });	
}

module.exports = middlewareObj;