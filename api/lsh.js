// import {Vector as V, Table as T} from 'hamming-lsh';
var Table     = require("./hamming-lsh/hamming-lsh-master/lib/table"),
	Vector    = require("./hamming-lsh/hamming-lsh-master/lib/vector"),
	express   = require("express"),
	mongoose  = require("mongoose"),
	Matrix    = require("./models/table"),
	User      = require("./models/user"),
	Home      = require("./models/home"); 



 function getReccomendations(userId){
 	Matrix.find({}, function(err, matrix){
        const d = matrix[0].vectors[0].length+1;
		const k = 2;
		const l = 2;
		const t = new Table(d, k, l);
		for(var i = 0 ; i < matrix[0].vectors.length ; i++){
			matrix[0].vectors[i].unshift(1);
			const v = new Vector(matrix[0].vectors[i]);
            t.add(v);
		}
		var size = t.size();
        var userVector = [];
        var flag;
        userVector.push(1);
		User.findById(userId).populate("Reviews").populate("housesViewed").exec(function(err, user){
			if(err){
				console.log("User not found");
			}
			else{
				var revlen = user.Reviews.length;
				reviews = user.Reviews;
				Home.find({}, function(err, homes){
					var len = homes.length;
					if(revlen !== 0){
						for(var i = 0 ; i < len ; i++){
				   	  		flag = 0;
			   	  			for(var j = 0 ; j < revlen ; j++){
				   	  			var r = reviews[j];
				   	  			if(homes[i]._id.equals(r.home.id)){
				   	  				if(reviews[j].rating > 2){
				   	  					flag = 1;
				   	  					break;
				   	  				}
				   	  			}
			   	  		    }
			   	  		    userVector.push(flag);
						}
				    }
				    else if(user.housesViewed.length > 0) {
				    	var index1, index2;
				        var viewLen = user.housesViewed.length;
				        var viewed = user.housesViewed;
				    	for(var i = 0 ; i < len ; i++){
				    		flag = 0;
				    		for(var y = 0 ; y < viewLen ; y++){
				    			if(homes[i]._id.equals(viewed[y]._id)){
				    				flag += 3;
				    				break;
				    			}	
				    		}
				    		index1 = user.searchedLocations.indexOf(homes[i].city);
				    		index2 = user.searchedLocations.indexOf(homes[i].country);
		    				if(index1 > -1 || index2 > -1){
		    					flag += 2;
		    				}
		    				for(var k=0 ; k < user.searchedGuests; k++){
		    					if(user.searchedGuests[k] <= homes[i].guests){
		    						flag += 2;
		    						break;
		    					}
		    				}
		    				if(flag >= 4){
		    					flag = 1;
		    					userVector.push(flag);
		    				}
		    				else{
		    					flag = 0;
		    					userVector.push(flag);
		    				}
				    			
				    	}
				    }
				    else{
				    	return;
					}
				    const q = new Vector(userVector);
				    var result = t.query(q);

	                var reslen = result.length;
	                var res = []

	                for(i = 0 ; i < reslen ; i ++) {
	                	res[i] = result[i].vec.toArray();
	                }
	                
	                var finalRes = []
	                for(var i = 1 ; i < res[0].length ; i++) {
	                	var total = 0;
	                	for(var y = 0 ; y < res.length; y ++){
	                		total += res[y][i];
	                	}
	                	finalRes.push(total);
	                }

	                var first = 0, second = 0;
	                var indexFirst= 0, indexSecond = 1;

	                for(var i = 0 ; i < finalRes.length ; i++){
	                	if(finalRes[i] >= first){
	                		second = first;
	                		indexSecond = indexFirst;
	                		first = finalRes[i];
	                		indexFirst = i;
	                	}
	                	else if(finalRes[i] > second){
	                		second = finalRes[i];
	                		indexSecond = i;
	                	}
	                }

	                Home.find({}, function(err, homes){
	                	var allHomes = homes;
	                	user.recommended = [];
	                	user.recommended.push(homes[indexFirst]);
	                	user.recommended.push(homes[indexSecond]);
	                	user.save();
	                });
	                User.findById(userId, function(err, user){
			            console.log("RECOMMENDED " + user.recommended);
		            });
				});
			}
		});
 	});
 }

module.exports = getReccomendations;
