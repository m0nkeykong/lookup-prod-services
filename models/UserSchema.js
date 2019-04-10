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
    accessibility: {type: Number, default: null},                                       // 0 - Normal | 1 - Blind | 2 - Deaf
    rank: {level: {type: String, default: null}, code: {type: Number, default: null}},  // 0 - Baby, 1 - Tyro, 2 - Warrior, 3 - Knight, 4 - Royalty
    favoriteTracks: [{type: mongoose.Schema.Types.ObjectId, ref: "TrackSchema", default: null}],
    trackRecords: [{type: mongoose.Schema.Types.ObjectId, ref: "TrackSchema", default: null}, [{duration: Date, default: null}]],
    BLE: {type: mongoose.Schema.Types.ObjectId, ref: "BLESchema", default: null}
});

module.exports = mongoose.model("UserSchema", UserSchema, "Users");