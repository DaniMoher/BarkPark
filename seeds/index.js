//required software
const mongoose = require('mongoose');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers');
const Park = require('../models/park');

// connect to mongoose
mongoose.connect('mongodb://127.0.0.1:27017/bark-park')
    .then(() => {
        console.log('Mongo Connected Successfully')
    })
    .catch(err => {
        console.log('Mongo Encountered error:')
        console.log(err)
    })
// return random element from array
const sample = array => array[Math.floor(Math.random() * array.length)];

// seed MongoDB with fake locations
const seedDB = async () => {
    await Park.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const park = new Park({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await park.save();
    }
}
// run seed update, and then closes server
seedDB().then(() => {
    mongoose.connection.close()
})