var express 		    = require("express"),
    app 			      = express(),
    bodyParser 		  = require("body-parser"),
    mongoose 		    = require("mongoose")
    passport 		    = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override")
    User            = require("./models/user.js"),
    Home            = require("./models/home.js"),
    seedDB          = require("./seeds"),
    tableCr         = require("./create-table"),
    getRec          = require("./lsh"),
    http            = require("http"),
    fs              = require("fs"),
    https           = require("https"); //file for seeding database with data

// Require routes
var indexRoutes = require("./routes/index"),
    homeRoutes  = require("./routes/homes");

var options = {
   key  : fs.readFileSync('./ssl/server.key'),
   cert : fs.readFileSync('./ssl/server.crt')
};

app.use('/static', express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', "X-Requested-With, Content-Type, Origin, Authorization, userId, Accept, Client-Security-Token, Accept-Encoding");
  next();
});


// Use native Node promises
// mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/airbnb");
app.use(methodOverride("_method"));
//seedDB();


 //Passport configuration for user authentication
app.use(require("express-session")({
    secret: "",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy()); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//make current user visible to all templates
app.use(function(req, res, next){
   res.locals.currentUser  = req.user;
   next();
});

app.use(indexRoutes);
app.use(homeRoutes);


const port = process.env.PORT || '3000';
app.set('port', port);

const server = https.createServer(options, app);

server.listen(port, () => console.log(`Running on localhost:${port}`));

