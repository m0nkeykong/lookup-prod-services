var mongoose  = require('mongoose');

var MapSchema = new mongoose.Schema({
        id: mongoose.Schema.Types.ObjectId,
    }
);
 

var Map = mongoose.model("MapSchema", MapSchema, "Maps");
module.exports = Map;