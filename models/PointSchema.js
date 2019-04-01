var mongoose = require('mongoose');

var PointSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    longitude: {
        type: Number,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("PointSchema", PointSchema, "Points");