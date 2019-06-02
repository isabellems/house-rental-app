export class Comment {
	constructor(  	
	   public text: String,
	   public _id? : String,
	   public author?: {
	   	  id: String,
	   	  username: String
	   }
   ){}	
}
