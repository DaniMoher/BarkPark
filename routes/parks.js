const express = require('express');
const router = express.Router();
const parks = require('../controllers/parks')
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, validatePark, isAuthor } = require('../middleware.js');

const Park = require('../models/park');

//form to create new park
router.get('/new', isLoggedIn, parks.renderNewForm)

router.route('/')
    .get(catchAsync(parks.index)) //show all parks
    .post(isLoggedIn, validatePark, catchAsync(parks.createPark)) //submits new location

router.route('/:id')
    //show details of one park
    .get(catchAsync(parks.parkDetails))//show details of one park
    .put(isLoggedIn, isAuthor, validatePark, catchAsync(parks.editPark))//submit edit to park
    .delete(isLoggedIn, isAuthor, catchAsync(parks.deletePark))//delete a park
//edit existing park
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(parks.renderEditForm))

module.exports = router;