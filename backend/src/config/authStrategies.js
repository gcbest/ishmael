const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook').Strategy;
const { findOrCreateUser } = require('../lib/utils');
const { AUTHTYPE } = require('../lib/const');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    done(null, { id });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, cb) =>
            findOrCreateUser(profile, AUTHTYPE.GOOGLE, cb)
    )
);

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: '/auth/facebook/callback',
        },
        async (accessToken, refreshToken, profile, cb) =>
            findOrCreateUser(profile, AUTHTYPE.FACEBOOK, cb)
    )
);
