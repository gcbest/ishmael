const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const uuid = require('uuid/v4');

const db = require('../db');

// const connectAuths = passport => {
// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(user, done) {
    // User.findById(id, function(err, user) {
    //     done(err, user);
    // });
    done(null, user);
});

// =========================================================================
// LOCAL LOGIN =============================================================
// =========================================================================
// passport.use(
//     'local-login',
//     new LocalStrategy(
//         {
//             // by default, local strategy uses username and password, we will override with email
//             usernameField: 'email',
//             passwordField: 'password',
//             passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
//         },
//         function(req, email, password, done) {
//             process.nextTick(function() {
//                 User.findOne({ 'local.email': email }, function(err, user) {
//                     // if there are any errors, return the error
//                     if (err) return done(err);

//                     // if no user is found, return the message
//                     if (!user)
//                         return done(null, false, req.flash('loginMessage', 'No user found.'));

//                     if (!user.validPassword(password))
//                         return done(
//                             null,
//                             false,
//                             req.flash('loginMessage', 'Oops! Wrong password.')
//                         );

//                     // all is well, return user
//                     return done(null, user);
//                 });
//             });
//         }
//     )
// );

// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// passport.use(
//     'local-signup',
//     new LocalStrategy(
//         {
//             // by default, local strategy uses username and password, we will override with email
//             usernameField: 'email',
//             passwordField: 'password',
//             passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
//         },
//         function(req, email, password, done) {
//             process.nextTick(function() {
//                 //  Whether we're signing up or connecting an account, we'll need
//                 //  to know if the email address is in use.
//                 User.findOne({ 'local.email': email }, function(err, existingUser) {
//                     // if there are any errors, return the error
//                     if (err) return done(err);

//                     // check to see if there's already a user with that email
//                     if (existingUser)
//                         return done(
//                             null,
//                             false,
//                             req.flash('signupMessage', 'That email is already taken.')
//                         );

//                     //  If we're logged in, we're connecting a new local account.
//                     if (req.user) {
//                         const { user } = req;
//                         user.local.email = email;
//                         user.local.password = user.generateHash(password);
//                         user.save(function(err) {
//                             if (err) throw err;
//                             return done(null, user);
//                         });
//                     }
//                     //  We're not logged in, so we're creating a brand new user.
//                     else {
//                         // create the user
//                         const newUser = new User();

//                         newUser.local.email = email;
//                         newUser.local.password = newUser.generateHash(password);

//                         newUser.save(function(err) {
//                             if (err) throw err;

//                             return done(null, newUser);
//                         });
//                     }
//                 });
//             });
//         }
//     )
// );

// =========================================================================
// FACEBOOK ================================================================
// =========================================================================
// passport.use(
//     new FacebookStrategy(
//         {
//             clientID: process.env.FACEBOOK_APP_ID,
//             clientSecret: process.env.FACEBOOK_APP_SECRET,
//             callbackURL: 'http://localhost:4000/auth/facebook/callback',
//         },
//         async function(req, token, refreshToken, profile, done) {
//             process.nextTick(function() {
//                 // check if the user is already logged in
//                 if (!req.user) {
//                     User.findOne({ 'facebook.id': profile.id }, function(err, user) {
//                         if (err) return done(err);

//                         if (user) {
//                             // if there is a user id already but no token (user was linked at one point and then removed)
//                             if (!user.facebook.token) {
//                                 user.facebook.token = token;
//                                 user.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;
//                                 user.facebook.email = profile.emails[0].value;

//                                 user.save(function(err) {
//                                     if (err) throw err;
//                                     return done(null, user);
//                                 });
//                             }

//                             return done(null, user); // user found, return that user
//                         }
//                         // if there is no user, create them
//                         const newUser = new User();

//                         newUser.facebook.id = profile.id;
//                         newUser.facebook.token = token;
//                         newUser.facebook.name = `${profile.name.givenName} ${profile.name.familyName}`;
//                         newUser.facebook.email = profile.emails[0].value;

//                         newUser.save(function(err) {
//                             if (err) throw err;
//                             return done(null, newUser);
//                         });
//                     });
//                 } else {
//                     // user already exists and is logged in, we have to link accounts
//                     const { user } = req; // pull the user out of the session
//                     const facebook = {
//                         id: profile.id,
//                         token,
//                         name: `${profile.name.givenName} ${profile.name.familyName}`,
//                         email: profile.emails[0].value,
//                     };

//                     // user.save(function(err) {
//                     //     if (err) throw err;
//                     //     return done(null, user);
//                     // });

//                     db.mutation.updateUser({
//                         where: { email: user.local.email },
//                         data: { facebook },
//                     });
//                 }
//             });
//         }
//     )
// );

// =========================================================================
// GOOGLE ==================================================================
// =========================================================================
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
            passReqToCallback: true,
        },
        async function(accessToken, refreshToken, profile, cb) {
            // check if the user is already logged in
            // if (!req.user) {
            const existingUser = await db.query
                .users(
                    { where: { google: { id: profile.id } } },
                    // '{ id, permissions, email, name }'
                    '{ id }'
                )
                .catch(e => {
                    throw Error(`Error finding user: ${e}`);
                });

            if (existingUser.length > 0) {
                return cb(null, existingUser[0]);
            }
            // TODO: create user and check passing userID
            const newId = uuid().slice(20);
            const newUser = await db.mutation
                .createUser({
                    data: {
                        id: newId,
                        // local: { id: newId },
                        // google: {
                        //     id: profile.id,
                        //     token: accessToken,
                        //     email: profile.emails,
                        //     name: profile.displayName,
                        // },
                        permissions: { set: ['USER'] },
                    },
                })
                .catch(e => {
                    throw Error(`Error creating user: ${e}`);
                });

            console.log(newUser);

            return cb(null, newUser);

            // User.findOne({ 'google.id': profile.id }, function(err, user) {
            //     if (err) return done(err);

            //     if (user) {
            //         // if there is a user id already but no token (user was linked at one point and then removed)
            //         if (!user.google.token) {
            //             user.google.token = token;
            //             user.google.name = profile.displayName;
            //             user.google.email = profile.emails[0].value; // pull the first email

            //             user.save(function(err) {
            //                 if (err) throw err;
            //                 return done(null, user);
            //             });
            //         }

            //         return done(null, user);
            //     }
            //     const newUser = new User();

            //     newUser.google.id = profile.id;
            //     newUser.google.token = token;
            //     newUser.google.name = profile.displayName;
            //     newUser.google.email = profile.emails[0].value; // pull the first email

            //     newUser.save(function(err) {
            //         if (err) throw err;
            //         return done(null, newUser);
            //     });
            // });
            // }

            // user already exists and is logged in, we have to link accounts
            // const { user } = req; // pull the user out of the session

            // user.google.id = profile.id;
            // user.google.token = accessToken;
            // user.google.name = profile.displayName;
            // user.google.email = profile.emails[0].value; // pull the first email

            // const updatedUser = await db.mutation
            //     .updateUser({
            //         google: {
            //             id: profile.id,
            //             token: accessToken,
            //             email: profile.emails[0].value,
            //             name: profile.displayName,
            //         },
            //     })
            //     .catch(e => {
            //         throw Error(`Could not update user: ${e}`);
            //     });

            // return cb(null, updatedUser);
        }
    )
);
// };

// module.exports = connectAuths;
