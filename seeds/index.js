const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Property = require('../property');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Property.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const property = new Property({
            author: '645132291576dc38693dad61',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`, price: price,
            description: " this is a nice camp ground  this is a nice camp ground  this is a nice camp ground this is a nice camp ground this is a nice camp ground this is a nice camp ground this is a nice camp ground",
            images: [
                {
                    url: 'https://res.cloudinary.com/dxmrpempn/image/upload/v1683207609/YelpCamp/rfudesvhdfotrbzd79gw.jpg',
                    filename: 'YelpCamp/rfudesvhdfotrbzd79gw'

                },
                {
                    url: 'https://res.cloudinary.com/dxmrpempn/image/upload/v1683207610/YelpCamp/pl9ichqf2ghs0zexwymi.jpg',
                    filename: 'YelpCamp/pl9ichqf2ghs0zexwymi'

                },
                {
                    url: 'https://res.cloudinary.com/dxmrpempn/image/upload/v1683207612/YelpCamp/tkuhxekbqevpn5pbmp8b.jpg',
                    filename: 'YelpCamp/tkuhxekbqevpn5pbmp8b'

                },
                {
                    url: 'https://res.cloudinary.com/dxmrpempn/image/upload/v1683207615/YelpCamp/xcydlwiohr5not9ruh3x.jpg',
                    filename: 'YelpCamp/xcydlwiohr5not9ruh3x'

                },
                {
                    url: 'https://res.cloudinary.com/dxmrpempn/image/upload/v1683207617/YelpCamp/h8t1umuznn4pobzmfnk8.jpg',
                    filename: 'YelpCamp/h8t1umuznn4pobzmfnk8'

                }
            ]
        })
        await property.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})