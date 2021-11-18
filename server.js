const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const routes = require('./routes.js');
//const config = require('./config')
const conn = require('./models/user')
app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(new FacebookStrategy({
    clientID:"445384943871022",
    clientSecret:"e15bd85c84ba97e6d981c3e52fd87859",
    callbackURL:"http://localhost:8000/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'email', 'picture.type(large)'],
  },
  function(request, accessToken, refreshToken, profile, done) {
    let row = "SELECT uid FROM user_google WHERE uid = '"+profile.id+"'" ; 
    console.log(row);
    if(row.uid == profile.id) {
     console.log("User exists")
    }
        else{
            
 console.log(profile.name.givenName);
 let st = "INSERT INTO user_google VALUES('"+profile.id+"','"+profile.name.givenName+"','"+profile.emails[0].value+"','"+profile.photos[0].value+"')";
 
 // Creating queries
 conn.query(st, (err, rows) => {
     if (err) throw err;
     console.log("Row inserted "+rows);
 });
        
        }
       
 console.log(profile)
 return done(null, profile);
       }
  /*function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }*/
));

app.use('/', routes);

const port = 8000;

app.listen(port, () => {
  console.log('App listening on port ' + port);
});