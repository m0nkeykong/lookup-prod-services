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
      wayPoints: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "PointSchema"
      }],
      type: {
            type: String,
            required: true
      },
      description: {
            type: String,
            required: true
      },
      title: {
            type: String,
            required: true,
            unique: true
            // validate: isUnique
      },
      comments: [String],
      duration: Number,
      rating: {
            type: Number
      },
      changesDuringTrack: {
            type: Boolean
      },
      diffucultyLevel: {
            type: Number
      }
});

module.exports = mongoose.model("TrackSchema", TrackSchema, "Tracks");
