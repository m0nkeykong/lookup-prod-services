var mongoose  = require('mongoose');

var MapSchema = new mongoose.Schema({
        id: mongoose.Schema.Types.ObjectId,
        center: {type: Number, default: 15},
        zoom: {type: Number, default: null},
        layer: [{type: Number, default: null}],
        geoCoordinates: [{type: String, default: null}],
        Options: {type: String, required: true},
        NavigationMode: {type: Number, required: true},
    }
);

var Map = mongoose.model("MapSchema", MapSchema, "Maps");
module.exports = Map;