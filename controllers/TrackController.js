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

// Update Track by id
router.put('/updateTrack/:trackId', onlyNotEmpty, (req, res) => {
      // Find and update user accounnt
      Track.findByIdAndUpdate(req.params.trackId, req.bodyNotEmpty, (err, docs) => {
            if (err) return res.status(500).send(err);
            if (!docs) return res.status(404).send({ "Message": `Track ID was not found in the system` });
            // console.log(`User: ${docs.title} updated successfully`);
            res.status(200).send(docs);
      });
});

/** 
    values required:
         title
**/

// router.delete('/deleteTrackBytitle/:title', (req, res) => {

//       Track.findOne({ title: req.body.title }, (err, track) => {
//             console.log(`Track1: ${track}`);
//             if (err) res.status(500).send(err);
//             else if (track) {
//                   Track.findByIdAndRemove(track._id, (err, docs) => {
//                         if (err) return res.status(400).send(err);
//                         if (!docs) return res.status(404).send({ "Message": `Track title was not found in the system` });
//                         console.log(`User: ${docs.title} deleted successfully`);
//                         res.status(200).send(docs);
//                   });
//             }
//             else{
//                   console.log(`Track2: ${track}`);
//                  return res.status(500).send("something wrong");

//             }
//       });

// });

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
                  });
                  // find all users that have this track in "favoriteTracks" array and "trackRecords" array
                  deleteFavoriteTracksFromUsers(track._id).then((result, err) => {
                        if(err) console.log(`there was a problem with: deleteFavoriteTracksFromUsers `);
                        else{
                              deleteTrackRecordsFromUsers(track._id).then((result, err) => {
                              if (err)
                                    return res.status(200).send(err);
                              
                                    return res.status(200).send("Ok");
                              });
                        }
                  });

                  // TODO: remove specific track!
                  // Track.findByIdAndRemove(track._id, (err, docs) => {
                  //       if (err) return res.status(400).send(err);
                  //       if (!docs) return res.status(404).send({ "Message": `Track title was not found in the system` });
                  //       console.log(`User: ${docs.title} deleted successfully`);
                  //       res.status(200).send(docs);
                  // });
            }
            else {
                  res.status(200).send("Track not exist");
            }
      });

});

// var deleteFavoriteTracksFromUsers = (trackId) => {
//       return new Promise((resolve, reject) => {
//             console.log("function: deleteFavoriteTracksFromUsers");

//             User.find({ favoriteTracks: id }, (err, user) => {
//                   console.log("333333");

//                   user.forEach((usr) => {
//                         console.log("555555");

//                         usr.favoriteTracks.forEach((element) => {
//                               var cond = { favoriteTracks: element },
//                                     update = { $pull: { favoriteTracks: id } },
//                                     opts = { multi: true };
//                               console.log("444444");

//                               User.update(cond, update, opts, err => {
//                                     if (err) {
//                                           console.log(err);
//                                           console.log("991199");
//                                           return false;
//                                     }
//                               });
//                         });
//                   })
//             });
//             return true;
//       });
// }

// var deleteTrackRecordsFromUsers = (trackId) => {
//       return new Promise((resolve, reject) => {
//             console.log("function: deleteTrackRecordsFromUsers");

//             User.find({ trackRecords: id }, (err, user) => {
//                   user.forEach((usr) => {
//                         usr.trackRecords.forEach((element) => {
//                               var cond = { trackRecords: element },
//                                     update = { $pull: { trackRecords: id } },
//                                     opts = { multi: true };
//                               console.log("2222222");

//                               User.update(cond, update, opts, err => {
//                                     if (err) {
//                                           console.log(err);
//                                           console.log("992299");
//                                           return false;
//                                     }
//                               });
//                         });
//                   })
//             });
//             return true;
//       });
// }


// var deleteTrackById = (id) => { // return boolean
//       return new Promise((resolve, reject) => {
//             console.log("function: deleteTrackById");

//             console.log(`id: ${id}`);
//             Track.findByIdAndRemove(id, (err, doc) => {
//                   if (err) {
//                         console.log(err);
//                         return false;
//                   }
//                   else if (doc) return true;
//                   else {
//                         console.log("Error with 'deleteTrackById' function");
//                         return false;
//                   }
//             });
//       });

// }

var deleteTrackFromUsers = (id) => {            // return boolean

      return new Promise((resolve, reject) => {
            console.log("function: deleteTrackFromUsers");

            User.find({ favoriteTracks: id }, (err, user) => {
                  console.log("333333");

                  user.forEach((usr) => {
                        console.log("555555");

                        usr.favoriteTracks.forEach((element) => {
                              var cond = { favoriteTracks: element },
                                    update = { $pull: { favoriteTracks: id } },
                                    opts = { multi: true };
                              console.log("444444");

                              User.update(cond, update, opts, err => {
                                    if (err) {
                                          console.log(err);
                                          console.log("991199");

                                          return false;
                                    }
                              });
                        });
                  })
            });
            console.log("1111111");
            User.find({ trackRecords: id }, (err, user) => {
                  user.forEach((usr) => {
                        usr.trackRecords.forEach((element) => {
                              var cond = { trackRecords: element },
                                    update = { $pull: { trackRecords: id } },
                                    opts = { multi: true };
                              console.log("2222222");

                              User.update(cond, update, opts, err => {
                                    if (err) {
                                          console.log(err);
                                          console.log("992299");

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