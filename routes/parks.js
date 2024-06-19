const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, validatePark, isAuthor } = require('../middleware.js');

const Park = require('../models/park');

//show all parks
router.get('/', catchAsync(async (req, res) => {
    const parks = await Park.find({})
    res.render('parks/index', { parks })
}))

//form to create new park
router.get('/new', isLoggedIn, (req, res) => {
    res.render('parks/new');
})

//show details of one park
router.get('/:id', catchAsync(async (req, res,) => {
    const park = await Park.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!park) {
        req.flash('error', 'Park not found');
        return res.redirect('/parks');
    }
    res.render('parks/show', { park })
}))

//submits new location
router.post('/', isLoggedIn, validatePark, catchAsync(async (req, res, next) => {
    const park = new Park(req.body.park);
    park.author = req.user._id;
    await park.save();
    req.flash('success', 'New park created!')
    res.redirect(`/parks/${park._id}`)
}))

//edit existing park
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const park = await Park.findById(req.params.id)
    if (!park) {
        req.flash('error', 'Park not found');
        return res.redirect('/parks');
    }
    res.render('parks/edit', { park })
}))

//submit edit to park
router.put('/:id', isLoggedIn, isAuthor, validatePark, catchAsync(async (req, res) => {
    const { id } = req.params;
    const park = await Park.findByIdAndUpdate(id, { ...req.body.park });
    req.flash('success', 'Updated Successfully!')
    res.redirect(`/parks/${park._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Park.findByIdAndDelete(id);
    req.flash('success', 'Park has been deleted.')
    res.redirect('/parks')
}))

module.exports = router;