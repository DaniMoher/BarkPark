const Park = require('../models/park');

//show all parks
module.exports.index = async (req, res) => {
    const parks = await Park.find({})
    res.render('parks/index', { parks })
}
//new park form
module.exports.renderNewForm = (req, res) => {
    res.render('parks/new');
}
//submit new park form
module.exports.createPark = async (req, res, next) => {
    const park = new Park(req.body.park);
    park.author = req.user._id;
    await park.save();
    req.flash('success', 'New park created!')
    res.redirect(`/parks/${park._id}`)
}
//park details
module.exports.parkDetails = async (req, res,) => {
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
}
//form to edit park
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const park = await Park.findById(req.params.id)
    if (!park) {
        req.flash('error', 'Park not found');
        return res.redirect('/parks');
    }
    res.render('parks/edit', { park })
}
//submit edit to park
module.exports.editPark = async (req, res) => {
    const { id } = req.params;
    const park = await Park.findByIdAndUpdate(id, { ...req.body.park });
    req.flash('success', 'Updated Successfully!')
    res.redirect(`/parks/${park._id}`)
}
//delete park
module.exports.deletePark = async (req, res) => {
    const { id } = req.params;
    await Park.findByIdAndDelete(id);
    req.flash('success', 'Park has been deleted.')
    res.redirect('/parks')
}