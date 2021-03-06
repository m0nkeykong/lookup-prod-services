var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    email: {type: String, required: true},
    birthDay: {type: String, default: null},
    profilePicture: {type: String, required: true},
    createdDate: {type: Date, default: null},
    password: {type: String},
    phone: {type: Number},
    totalDistance: {type: Number, default: 0},
    accessibility: {type: Number, default: null},      
    rank: {type: Number, default: 0},   
    favoriteTracks: [{type: mongoose.Schema.Types.ObjectId, ref: "TrackSchema", default: null}],
    trackRecords: [{type: mongoose.Schema.Types.ObjectId, ref: "TrackSchema", default: null}],
    BLE: {type: mongoose.Schema.Types.ObjectId, ref: "BLESchema", default: null}
});

module.exports = mongoose.model("UserSchema", UserSchema, "Users");