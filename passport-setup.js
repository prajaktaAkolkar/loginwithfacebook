const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const conn = require('./models/user');

passport.serializeUser(function(user, done) {
    
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    
    done(null, user);
});

passport.use(new facebookStrategy({
    clientID:"974950616431250",
    clientSecret:"88584a06f1117f247293df0ae4d1bc9e",
    callbackURL:"http://localhost:8000/facebook/callback",
    passReqToCallback:true,
    profileFields: ['id', 'displayName', 'name', 'email', 'picture.type(large)']
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
      })
  );