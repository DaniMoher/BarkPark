//required software
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { parkSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError')
const methodOverride = require('method-override');
const Park = require('./models/park');
const Review = require('./models/reviews');

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

//middleware validation
const validatePark = (req, res, next) => {
    const { error } = parkSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


//home page
app.get('/', (req, res) => {
    res.render('home')
})

//show all parks
app.get('/parks', catchAsync(async (req, res) => {
    const parks = await Park.find({})
    res.render('parks/index', { parks })
}))

//form to create new park
app.get('/parks/new', (req, res) => {
    res.render('parks/new');
})

//show details of one park
app.get('/parks/:id', catchAsync(async (req, res) => {
    const park = await Park.findById(req.params.id).populate('reviews');
    res.render('parks/show', { park })
}))

//submits new location
app.post('/parks', validatePark, catchAsync(async (req, res, next) => {
    const park = new Park(req.body.park);
    await park.save();
    res.redirect(`/parks/${park._id}`)
}))

//edit existing park
app.get('/parks/:id/edit', catchAsync(async (req, res) => {
    const park = await Park.findById(req.params.id)
    res.render('parks/edit', { park })
}))

//submit edit to park
app.put('/parks/:id', validatePark, catchAsync(async (req, res) => {
    const { id } = req.params;
    const park = await Park.findByIdAndUpdate(id, { ...req.body.park });
    res.redirect(`/parks/${park._id}`)
}))

//delete a park (and it's reviews)
app.delete('/parks/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Park.findByIdAndDelete(id);
    res.redirect('/parks')
}))

//delete a rating
app.delete('/parks/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Park.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/parks/${id}`);
}))

//leave a rating
app.post('/parks/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const park = await Park.findById(req.params.id);
    const review = new Review(req.body.review);
    park.reviews.push(review);
    await review.save();
    await park.save();
    res.redirect(`/parks/${park._id}`)
}))

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