const { parkSchema, reviewSchema } = require('./schemas.js');

const ExpressError = require('./utilities/ExpressError.js');
const Park = require('./models/park');
const Review = require('./models/reviews');

//middleware - is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in to do this');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

//middleware validation
module.exports.validatePark = (req, res, next) => {
    const { error } = parkSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
// middleware author authorization
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const park = await Park.findById(id);
    if (!park.author.equals(req.user_id)) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/parks/${id}`);
    }
    next();
}

// middleware review authorization
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user_id)) {
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/parks/${id}`);
    }
    next();
}

//middleware for review validation
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}