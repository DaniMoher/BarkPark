const Park = require('../models/park');
const Review = require('../models/reviews');

module.exports.createReview = async (req, res) => {
    const park = await Park.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    park.reviews.push(review);
    await review.save();
    await park.save();
    req.flash('success', 'Review posted!')
    res.redirect(`/parks/${park._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Park.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review has been deleted.')
    res.redirect(`/parks/${id}`);
}