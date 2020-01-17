const express = require('express');
const passport = require('passport');
const { setCookieAndRedirect } = require('../lib/utils');

const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

// router.get(
//     '/google/callback',
//     passport.authenticate('google', { failureRedirect: '/login' }),
//     function(req, res) {
//         // Successful authentication, redirect home.
//         res.redirect('/');
//     }
// );

/** **** GOOGLE ***** */
// send to consent screen
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    setCookieAndRedirect
);

/** **** FACEBOOK ***** */
// send to consent screen
router.get('/facebook', passport.authenticate('facebook'));

router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    setCookieAndRedirect
);

module.exports = router;
