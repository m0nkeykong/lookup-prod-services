var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    email: {type: String, required: true, index: 1},
    birthDay: {type: String, required: true},
    profilePicture: {type: String, required: true},
    password: {String},
    phone: {Number},
    accessibility: {Number},  // '0'-normal | '1'-blind | '2'-deaf
    favoriteTracks: [{type: mongoose.Schema.Types.ObjectId, ref: "TrackSchema"}],
    trackRecords: [{type: mongoose.Schema.Types.ObjectId, ref: "TrackSchema"}],
    BLE: {type: mongoose.Schema.Types.ObjectId, ref: "BLESchema"}
});

module.exports = mongoose.model("UserSchema", UserSchema, "Users");