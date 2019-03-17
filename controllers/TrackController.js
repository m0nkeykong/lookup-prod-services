const express = require('express'),
      router = express.Router(),
      User = require('../models/UserSchema'),
      Track = require('../models/TrackSchema'),
      Points = require('../models/PointSchema'),
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

/** 
    values required:
         title
**/
router.get('/getTrackById/:trackId', (req, res) => {
      console.log("Enter route(GET): /getTrackById");

      Track.findOne({
            _id: req.params.trackId
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

// Update Track by id
router.put('/updateTrack/:trackId', onlyNotEmpty, (req, res) => {
      // Find and update user accounnt
      Track.findByIdAndUpdate(req.params.trackId, req.bodyNotEmpty, (err, docs) => {
            if (err) return res.status(500).send(err);
            if (!docs) return res.status(404).send({
                  "Message": `Track ID was not found in the system`
            });
            // console.log(`User: ${docs.title} updated successfully`);
            res.status(200).send(docs);
      });
});

/** 
    values required:
         trackId
**/
router.delete('/deleteTrack/:trackId', async (req, res) => {

      try {
            trackId = req.params.trackId;
            await deleteStartPoint(trackId);
            await deleteEndPoint(trackId);
            await deleteMiddlePoint(trackId);
            await deleteFavoriteTracksFromUsers(trackId);
            await deleteTrackRecordsFromUsers(trackId);
            await deleteSpecificTrack(trackId);

            res.status(200).send(`OK`);

      } catch (e) {
            res.status(500).send(`NOT OK`);
      }

});

var deleteSpecificTrack = async (trackId) => {
      return new Promise((resolve, reject) => {
            console.log("function: deleteSpecificTrack");

            Track.findByIdAndRemove(trackId, (err, docs) => {
                  if (err) return reject(err);

                  console.log(`User: ${docs.title} deleted successfully`);
                  resolve(true);
            })
      })
}

var deleteStartPoint = async (trackId) => {
      return new Promise((resolve, reject) => {
            console.log("function: deleteStartPoint");

            Track.findOne({
                  _id: trackId
            }, (err, res) => {
                  if (err) reject(err);

                  Points.findByIdAndRemove(res.startPoint._id, err => {
                        if (err) reject(err);
                        resolve(true);
                  })
            })
      });
}

var deleteEndPoint = async (trackId) => {
      return new Promise((resolve, reject) => {
            console.log("function: deleteStartPoint");

            Track.findOne({
                  _id: trackId
            }, (err, res) => {
                  if (err) reject(err);

                  Points.findByIdAndRemove(res.startPoint._id, err => {
                        if (err) reject(err);
                        resolve(true);
                  })
            })
      });
}

var deleteMiddlePoint = async (trackId) => {
      return new Promise((resolve, reject) => {
            console.log("function: deleteStartPoint");

            Track.findOne({
                  _id: trackId
            }, (err, res) => {
                  if (err) reject(err);

                  res.middlePoint.forEach((element) => {
                        Points.findByIdAndRemove(element, err => {
                              if (err) reject(err);
                        });
                  });
                  resolve(true);
            })
      });
}

var deleteFavoriteTracksFromUsers = async (trackId) => {
      return new Promise((resolve, reject) => {
            console.log("function: deleteFavoriteTracksFromUsers");

            User.find({
                  favoriteTracks: trackId
            }, (err, user) => {
                  if (err) reject(err);
                  user.forEach((usr) => {
                        var cond = {
                                    _id: usr._id
                              },
                              update = {
                                    $pull: {
                                          favoriteTracks: trackId
                                    }
                              },
                              opts = {
                                    multi: true
                              };

                        User.update(cond, update, opts, err => {
                              if (err) {
                                    console.log(err);
                                    console.log("991199");
                                    resolve(err);
                              }
                        });
                  })
            });
            resolve(true);
      });
}

var deleteTrackRecordsFromUsers = async (trackId) => {
      return new Promise((resolve, reject) => {
            console.log("function: deleteTrackRecordsFromUsers");

            User.find({
                  trackRecords: trackId
            }, (err, user) => {
                  if (err) reject(err);
                  user.forEach((usr) => {
                        var cond = {
                                    _id: usr._id
                              },
                              update = {
                                    $pull: {
                                          trackRecords: trackId
                                    }
                              },
                              opts = {
                                    multi: true
                              };

                        User.update(cond, update, opts, err => {
                              if (err) {
                                    console.log(err);
                                    console.log("991199");
                                    resolve(err);
                              }
                        });
                  })
            });
            resolve(true);
      });

}


module.exports = router;