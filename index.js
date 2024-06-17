//required software
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Park = require('./models/park');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

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

//middleware
app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

//views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// home page
app.get('/', (req, res) => {
    res.render('home')
})
// show all parks
app.get('/parks', async (req, res) => {
    const parks = await Park.find({})
    res.render('parks/index', { parks })
})
// form to create new park
app.get('/parks/new', (req, res) => {
    res.render('parks/new');
})
// show details of one park
app.get('/parks/:id', async (req, res) => {
    const park = await Park.findById(req.params.id)
    res.render('parks/show', { park })
})
// submits new location
app.post('/parks', async (req, res) => {
    const park = new Park(req.body.park);
    await park.save();
    res.redirect(`/parks/${park._id}`)
})
// edit existing park
app.get('/parks/:id/edit', async (req, res) => {
    const park = await Park.findById(req.params.id)
    res.render('parks/edit', { park })
})
// submit edit to park
app.put('/parks/:id', async (req, res) => {
    const { id } = req.params;
    const park = await Park.findByIdAndUpdate(id, { ...req.body.park });
    res.redirect(`/parks/${park._id}`)
})
//delete a park
app.delete('/parks/:id', async (req, res) => {
    const { id } = req.params;
    await Park.findByIdAndDelete(id);
    res.redirect('/parks')
})

//port connection
app.listen(3000, () => {
    console.log('Connected to Port 3000 successfully')
})