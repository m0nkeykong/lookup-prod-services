var mongoose = require('mongoose');
var point = require('./PointSchema');

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
      reports: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "ReportsSchema"
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
      },
      duration: Number,
      changesDuringTrack: {
            type: Boolean
      },
      difficultyLevel: {
            star: {
                  type: Number,
                  required: true,
                  min: 1,
                  max: 5
            },
            countVotes: {
                  type: Number,
                  required: true,
                  default: 0
            }
      }
});


module.exports = mongoose.model("TrackSchema", TrackSchema, "Tracks");
