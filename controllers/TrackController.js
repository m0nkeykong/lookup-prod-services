const express = require('express'),
      router = express.Router(),
      User = require('../models/UserSchema'),
      Track = require('../models/TrackSchema'),
      BLE = require('../models/BLESchema'),
      settings = require('../config'),
      onlyNotEmpty = require('../controllers/onlyNotEmpty'),
      bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
      extended: true
}));

/** 
    values required:
        type, title, startPoint-id, endPoint-id
    values can be null:
        middlePoint, comment, rating, diffucultyLevel, changesDuringTrack
**/
router.post('/insertTrack', (req, res) => {
      console.log("Enter route(POST): /insertTrack");
      const newTrack = new Track(req.body);
      newTrack.save((err, track) => {
            if (err) res.status(500).send(err);
            else if (track) res.status(200).send(track);
            else res.status(500).send("Error create track");
      });
});

/** getTrackByTitle
    values required:
         title
**/
router.get('/getTrackByTitle/:title', (req, res) => {
      console.log("Enter route(GET): /getTrackByTitle");

      Track.findOne({
            title: req.params.title
      }, (err, track) => {
            if (err) res.status(500).send(err);
            else if (track) res.status(200).send(track);
            else res.status(500).send("Error find track");
      });
});

router.get('/getAllTracks', (req, res) => {
      console.log("Enter route(GET): /getAllTracks");

      Track.find({}, (err, tracks) => {
            if (err) res.status(500).send(err);
            else if (tracks) res.status(200).send(tracks);
            else res.status(500).send("Error find tracks");
      });
});

/** 
    values required:
         title
**/
router.delete('/deleteTrackBytitle/:title', (req, res) => {
      console.log("Enter route(DELETE): /deleteTrackBytitle");

      Track.findOne({
            title: req.params.title
      }, (err, track) => {
            if (err) res.status(500).send(err);
            else if (track) {
                  // remove startPoint
                  Points.findByIdAndRemove(track.startPoint._id, err => {
                        if (err) res.status(500).send(err);
                  });
                  // remove endPoint                  
                  Points.findByIdAndRemove(track.endPoint._id, err => {
                        if (err) res.status(500).send(err);
                  });
                  // remove all middle Points 
                  track.middlePoint.forEach((element) => {
                        Points.findByIdAndRemove(element, err => {
                              if (err) res.status(500).send(err);
                        });
                  })
                  // find all users that have this track in "favoriteTracks" array and "trackRecords" array
                  deleteTrackFromUsers(track._id).then((result, err) => {
                        if (err) res.status(500).send(config.errors.ERROR_DELETE_TRACK);
                        else if (result) res.status(200).send("OK");
                        else res.status(500).send(config.errors.ERROR_DELETE_TRACK);
                  });
                  // TODO: remove specific track!
            } else res.status(500).send(config.errors.ERROR_DELETE_TRACK);
      });
});

var deleteTrackFromUsers = (id) => { // return boolean

      return new Promise((resolve, reject) => {
            console.log("function: deleteTrackFromUsers");

            User.find({
                  favoriteTracks: id
            }, (err, user) => {
                  user.forEach((usr) => {
                        usr.favoriteTracks.forEach((element) => {
                              var cond = {
                                          favoriteTracks: element
                                    },
                                    update = {
                                          $pull: {
                                                favoriteTracks: id
                                          }
                                    },
                                    opts = {
                                          multi: true
                                    };

                              User.update(cond, update, opts, err => {
                                    if (err) {
                                          console.log(err);
                                          return false;
                                    }
                              });
                        });
                  })
            });
            User.find({
                  trackRecords: id
            }, (err, user) => {
                  user.forEach((usr) => {
                        usr.trackRecords.forEach((element) => {
                              var cond = {
                                          trackRecords: element
                                    },
                                    update = {
                                          $pull: {
                                                trackRecords: id
                                          }
                                    },
                                    opts = {
                                          multi: true
                                    };

                              User.update(cond, update, opts, err => {
                                    if (err) {
                                          console.log(err);
                                          return false;
                                    }
                              });
                        });
                  })
            });
            return true;
      });
};

module.exports = router;