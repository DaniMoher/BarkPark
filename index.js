//required software
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utilities/ExpressError')
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')

const parks = require('./routes/parks')
const reviews = require('./routes/reviews')


//mongoose connection
mongoose.connect('mongodb://127.0.0.1:27017/bark-park')
    .then(() => {
        console.log('Mongo Connected Successfully')
    })
    .catch(err => {
        console.log('Mongo Encountered error:')
        console.log(err)
    })

const app = express();

//views
app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

//session expires after 1 week
const sessionConfig = {
    secret: 'seeecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

//passport auth - MUST BE UNDER SESSION
app.use(passport.initialize());
app.use(passport.session());

//use local strategy on User model
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//flash error functions
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
//routes
app.use('/parks', parks)
app.use('/parks/:id/reviews', reviews)

//error catch
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

//error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'It looks like something went wrong.'
    res.status(statusCode).render('error', { err })
})

//port connection
app.listen(3000, () => {
    console.log('Connected to Port 3000 successfully')
})