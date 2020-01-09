const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const jwt = require('jsonwebtoken');
const db = require('../db');

passport.serializeUser((userId, done) => {
    done(null, userId);
});

passport.deserializeUser((id, done) => {
    done(null, { id });
});

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: 'http://localhost:4000/auth/facebook/callback',
        },
        function(accessToken, refreshToken, profile, cb) {
            // User.findOrCreate({ facebookId: profile.id }, function(err, user) {
            //     return cb(err, user);
            // });
            console.log(profile);

            return cb(null, profile.id);
        }
    )
);
