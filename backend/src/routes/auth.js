const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { addCookie } = require('../lib/utils');
// const { GraphQLServer } = require('graphql-yoga');

const router = express.Router();

/** **** GOOGLE ***** */
// send to consent screen
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// get profile info
router.get(
    '/google/callback',
    passport.authenticate('google'),
    // addCookie
    (req, res, next) => {
        const { user } = req;
        // create the JWT token for them
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        // We set the jwt as a cookie on the response
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
        });
        next();
    }
);

/** **** FACEBOOK ***** */
router.get('/facebook', passport.authenticate('facebook'));

router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    // addCookie
    function(req, res, next) {
        // Successful authentication, redirect home.
        const { user } = req;
        // create the JWT token for them
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        // We set the jwt as a cookie on the response
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
        });
        next();
    }
);

module.exports = router;
