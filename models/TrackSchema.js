var mongoose = require('mongoose');
var point = require('./PointSchema');

function isUnique(_title) {
      this.model('TrackSchema').find({ title: _title }, (err, track) => {
            if (err) {
                  console.log(err);
                  return false;
            }
            if (track == "")   // not found - title is unique
                  return true;
            else  // title exist
                  return false;
      })
}

var TrackSchema = new mongoose.Schema({
      id: mongoose.Schema.Types.ObjectId,
      startPoint: {type: mongoose.Schema.Types.ObjectId, ref: "PointSchema", required: true},
      endPoint: {type: mongoose.Schema.Types.ObjectId, ref: "PointSchema", required: true},
      wayPoints: [{type: mongoose.Schema.Types.ObjectId, ref: "PointSchema"}],
      reports: [{type: mongoose.Schema.Types.ObjectId, ref: "RepoersSchema"}],
      travelMode: {type: String, required: true},
      description: {type: String, required: true},
      title: {type: String, required: true, unique: true}, 
      distance: {type: Number, default: null},
      changesDuringTrack: {type: Boolean, default: 0},
      difficultyLevel: {star: {type: Number, min: 1, max: 5}, countVotes: {type: Number, required: true, default: 0}},
      // Minutes
      disabledTime: {actual: {type: Number, default: 0}, count: {type: Number, required: true, default: 0}},
      nonDisabledTime: {actual: {type: Number, default: 0}, count: {type: Number, required: true, default: 0}}
});

module.exports = mongoose.model("TrackSchema", TrackSchema, "Tracks");
