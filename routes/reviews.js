const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Park = require('../models/park');
const Review = require('../models/reviews');
const reviews = require('../controllers/reviews');
const catchAsync = require('../utilities/catchAsync');


//delete a rating
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

//leave a rating
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

module.exports = router;