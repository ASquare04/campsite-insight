const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    content: String,
    rating: Number
});

module.exports = mongoose.model('Review', reviewSchema);