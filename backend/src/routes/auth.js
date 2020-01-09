const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
// const { GraphQLServer } = require('graphql-yoga');

const router = express.Router();

// send to consent screen
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// get profile info
router.get('/google/callback', passport.authenticate('google'), (req, res, next) => {
    // TODO: abstract this
    const { user } = req;
    // create the JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // We set the jwt as a cookie on the response
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    next();
});
module.exports = router;
