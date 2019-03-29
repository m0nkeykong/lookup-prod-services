var mongoose = require('mongoose');

var PointSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    city: {
        type: String,
        required: true
    },
    longtitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("PointSchema", PointSchema, "Points");