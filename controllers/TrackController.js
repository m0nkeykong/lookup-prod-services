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
      Track.findOne({ title: req.params.title }, (err, track) => {
            if (err) {
                  res.status(500).send(err);
            }
            else if (track) {
                  console.log(track);
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
                        if (result)
                              console.log(`result: ${result}`);
                        res.status(500).send(config.errors.ERROR_DELETE_TRACK);
                  });
                  // TODO: remove specific track!
                  res.status(200).send("OK");
            }
            else{
                  // console.log("CCCCCCC");
                  res.status(500).send(config.errors.ERROR_DELETE_TRACK);
            }
      });

});

var deleteTrackById = (id) => { // return boolean
      return new Promise((resolve, reject) => {
            console.log("function: deleteTrackById");

            console.log(`id: ${id}`);
            Track.findByIdAndRemove(id, (err, doc) => {
                  if (err) {
                        console.log(err);
                        return false;
                  }
                  else if (doc) return true;
                  else {
                        console.log("Error with 'deleteTrackById' function");
                        return false;
                  }
            });
      });

}

var deleteTrackFromUsers = (trackId) => { // return boolean

      return new Promise((resolve, reject) => {
            console.log("function: deleteTrackFromUsers");
            console.log(`trackId: ${trackId}`);

            // TODO: why there is no id like that? => user return `[]`
            User.find({ favoriteTracks: trackId }, (err, user) => {
                  console.log(user);    
                  if(err) return false;
                  if(user.length == 0) return false;           
                  user.forEach((usr) => {
                        console.log(`USER: ${usr}`);
                        usr.favoriteTracks.forEach((element) => {
                              console.log(`ELEMENT: ${element}`);

                              var cond = { favoriteTracks: element },
                                    update = { $pull: { favoriteTracks: trackId } },
                                    opts = { multi: true };

                              User.findOneAndUpdate(cond, update, opts, err => {
                                    if (err) {
                                          console.log(err);
                                          return false;
                                    }
                              });
                        });
                  })
            });

            User.find({ trackRecords: trackId }, (err, user) => {
                  if(err) return false;
                  if(user.length == 0) return false;           
                  user.forEach((usr) => {
                        usr.trackRecords.forEach((element) => {
                              var cond = { trackRecords: element },
                                    update = { $pull: { trackRecords: trackId } },
                                    opts = { multi: true };

                              User.findOneAndUpdate(cond, update, opts, err => {
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