var mongoose    = require("mongoose"),
	faker		= require("faker"),
	User        = require("./models/user"),
	Matrix       = require("./models/table"),
    Home  		= require("./models/home");


function lsh() {
   var matrix = [];
   var homes = [];
   var table = new Matrix();
   Matrix.create(table, function(err, table){
	   Home.find({}).exec(function(err, all){
	   	   homes = all;
		   User.find().populate("Reviews").exec(function(err, users){
		   	  var uslen = users.length;
		   	  var homlen = homes.length;
		   	  for(var i = 0 ; i < uslen ; i++){
		   	  	var row = [];
		   	  	var revlen = users[i].Reviews.length;
		   	  	var reviews = users[i].Reviews;
		   	  	for(var y = 0 ; y < homlen ; y++){
		   	  		var flag = 0;

		   	  		if(revlen !== 0){
		   	  			console.log(reviews[j]);
		   	  			for(var j = 0 ; j < revlen ; j++){
			   	  			var r = reviews[j];
			   	  			if(homes[y]._id.equals(r.home.id)){
			   	  				if(reviews[j].rating > 2){
			   	  					flag = 1;
			   	  					break;
			   	  				}
			   	  			}
		   	  		    }
		   	    	}
		   	  		row.push(flag);
		   	  	}
		   	  	table.vectors.push(row);
		   	  	table.markModified('vectors');
	            table.save();
		   	  }
		   	  return(matrix);
		   });
		})
    });
}

module.exports = lsh;