const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors, descText, image} = require('./seedHelpers')
const Campground = require('../models/campground')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected"); 
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0; i< 15; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 15) + 10;
        const camp = new Campground({
            author: '66026675ed2b91b9d14d91c8', // Static Object._id
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:`${sample(image)}`,
            description: sample(descText),
            price
        })
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close()
})
