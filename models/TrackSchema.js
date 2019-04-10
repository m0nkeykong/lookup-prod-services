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
      startPoint: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PointSchema",
            required: true
      },
      endPoint: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PointSchema",
            required: true
      },
      // Change to middlePoints
      middlePoint: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "PointSchema"
      }],
      // Change to travelMode
      type: {
            type: String,
            required: true
      },
      // What is title?!?!
      title: {
            type: String,
            required: true,
            unique: true
            // validate: isUnique
      },
      comment: [String],
      rating: {
            type: Number
      },
      changesDuringTrack: {
            type: Boolean
      },
      // Change to fiffucultyLevel
      diffucultyLevel: {
            type: Number
      }
});

module.exports = mongoose.model("TrackSchema", TrackSchema, "Tracks");
