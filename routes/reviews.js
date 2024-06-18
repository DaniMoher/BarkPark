const express = require('express');
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../schemas.js');
const Park = require('../models/park');
const Review = require('../models/reviews');
const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//delete a rating
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Park.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review has been deleted.')
    res.redirect(`/parks/${id}`);
}))

//leave a rating
router.post('/', validateReview, catchAsync(async (req, res) => {
    const park = await Park.findById(req.params.id);
    const review = new Review(req.body.review);
    park.reviews.push(review);
    await review.save();
    await park.save();
    req.flash('success', 'Review posted!')
    res.redirect(`/parks/${park._id}`)
}))

module.exports = router;