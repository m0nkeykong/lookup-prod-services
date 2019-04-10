var mongoose = require('mongoose');

var PointSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    // What is type?!?!
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