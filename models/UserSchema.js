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
    accessibility: {type: Number, default: null},  // '0'-normal | '1'-blind | '2'-deaf
    favoriteTracks: [{type: mongoose.Schema.Types.ObjectId, ref: "TrackSchema", default: null}],
    trackRecords: [{type: mongoose.Schema.Types.ObjectId, ref: "TrackSchema", default: null}],
    BLE: {type: mongoose.Schema.Types.ObjectId, ref: "BLESchema", default: null}
});

module.exports = mongoose.model("UserSchema", UserSchema, "Users");