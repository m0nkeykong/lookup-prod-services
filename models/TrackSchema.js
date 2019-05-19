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
      title: {type: String, required: true, unique: true}, // validate: isUnique
      estimatedDuration: {type: Number},
      actualDuration: {type: Number},
      distance: {type: Number},
      rating: {type: Number},
      changesDuringTrack: {type: Boolean},
      difficultyLevel: {type: Number}
});

module.exports = mongoose.model("TrackSchema", TrackSchema, "Tracks");
