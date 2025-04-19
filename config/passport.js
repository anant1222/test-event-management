// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const dbHelper = require('../helper/dbHelper');

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: '/auth/google/callback'
// },
// async (accessToken, refreshToken, profile, done) => {
//   try {
//     const email = profile.emails[0].value;

//     // Check if user already exists in the database
//     const userExistsQuery = 'SELECT * FROM users WHERE email = ?';
//     const existingUser = await dbHelper.insertData(userExistsQuery, [email]);

//     if (existingUser.length > 0) {
//       return done(null, existingUser[0]);
//     }

//     // If the user does not exist, create a new one
//     const newUserQuery = 'INSERT INTO users (firstName, lastName, email, googleId) VALUES (?, ?, ?, ?)';
//     const newUserParams = [profile.name.givenName, profile.name.familyName, email, profile.id];
//     const newUser = await dbHelper.insertData(newUserQuery, newUserParams);

//     return done(null, newUser);
//   } catch (err) {
//     return done(err, null);
//   }
// }));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const userQuery = 'SELECT * FROM users WHERE id = ?';
//     const user = await dbHelper.insertData(userQuery, [id]);
//     done(null, user[0]);
//   } catch (err) {
//     done(err, null);
//   }
// });

// module.exports = passport;
