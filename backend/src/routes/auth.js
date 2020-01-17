const express = require('express');
const passport = require('passport');
const { setCookie } = require('../lib/utils');

const router = express.Router();

/** **** GOOGLE ***** */
// send to consent screen
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    setCookie
);

/** **** FACEBOOK ***** */
// send to consent screen
router.get('/facebook', passport.authenticate('facebook'));

router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    setCookie
);

module.exports = router;
