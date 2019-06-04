var mongoose = require('mongoose');

var PointSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    street: {
        type: String,
        default: null
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    lat: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("PointSchema", PointSchema, "Points");