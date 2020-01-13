// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const jwt = require('jsonwebtoken');
// const db = require('../db');

// passport.serializeUser((userId, done) => {
//     done(null, userId);
// });

// passport.deserializeUser((id, done) => {
//     done(null, { id });
// });

// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//             callbackURL: '/auth/google/callback',
//         },
//         async function(accessToken, refreshToken, profile, cb) {
//             const user = await db.query.user(
//                 { where: { id: profile.id } },
//                 // '{ id, permissions, email, name }'
//                 '{ id }'
//             );
//             // User.findOrCreate({ googleId: profile.id }, function(err, user) {
//             //     return cb(err, user);
//             // });
//             if (user) return cb(null, user);
//             // TODO: create user and check passing userID
//             const user = await db.mutation.createUser({
//                 data: {
//                     id: profile.id,
//                     permissions: { set: ['USER'] },
//                 },
//             });

//             return cb(null, userId);
//         }
//     )
// );
