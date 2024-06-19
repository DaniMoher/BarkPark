const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsyc = require('../utilities/catchAsync');
const User = require('../models/user');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');

router.route('/register')
    .get(users.registerForm)
    .post(catchAsyc(users.registerSubmit))
router.route('/login')
    .get(users.loginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginSubmit)

router.get('/logout', users.logout);

module.exports = router;