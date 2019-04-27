const express = require('express'),
      router = express.Router(),
      User = require('../models/UserSchema'),
      Track = require('../models/TrackSchema'),
      Points = require('../models/PointSchema'),
      Comments = require('../models/CommentsSchema'),
      onlyNotEmpty = require('../controllers/onlyNotEmpty'),
      bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/** 
    values required:
        type, title, startPoint-id, endPoint-id
    values can be null:
        wayPoints, comments, rating, diffucultyLevel, changesDuringTrack
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
         trackId
**/
router.get('/getTrackDetailsById/:trackId', (req, res) => {
      console.log("Enter route(GET): /getTrackById");

      Track.findOne({
            _id: req.params.trackId
      }, (err, track) => {
            if (err) res.status(500).send(err);
            else if (track) res.status(200).send(track);
            else res.status(500).send("Error find track");
      });
});

// /** getTrackById
//     values required:
//          trackId
// **/
// router.get('/getTrackById/:trackId', async (req, res) => {
//       console.log("Enter route(GET): /getTrackById");

//       try{
//             let id = req.params.trackId;
//             let track = await getTrackById(id);
//             let startPoint = await getPoint(track.startPoint);
//             let endPoint = await getPoint(track.endPoint); 
//             let wayPoints;
            
//             if( !(track.wayPoints.length == 0) ) {
//                   wayPoints = await getPoints(track.wayPoints); 
//                   console.log("MIDDLEEEEE:");
//                   console.log(wayPoints);
//             }
//             let result = await prepareResponse(track,startPoint,endPoint,wayPoints);
//             return res.status(200).send(result); 
//       } catch(e){
//             res.status(400).send(e.message);
//       }
        
// });

/** getTrackById
    values required:
         trackId
**/
router.get('/getTrackById/:trackId', async (req, res) => {
      console.log("Enter route(GET): /getTrackById");

      try{
            let id = req.params.trackId;
            let track = await getTrackById(id);
            let startPoint = await getPoint(track.startPoint);
            let endPoint = await getPoint(track.endPoint); 
            let wayPoints;
            
            if( (track.wayPoints.length !== 0) ) {
                  wayPoints = await getPoints(track.wayPoints); 
                  console.log("MIDDLEEEEE:");
                  console.log(wayPoints);
            }

            if( (track.comments.length !== 0) ) {
                  comments = await getComments(track.comments); 
                  console.log("comments:");
                  console.log(comments);
            }

            let result = await prepareResponse(track,startPoint,endPoint,wayPoints,comments);
            return res.status(200).send(result); 
      } catch(e){
            res.status(400).send(e.message);
      }
        
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
         city
**/
// once there is one point at 'startPoint' or 'endPoint' 
//from the same city and this track will be returned
router.get('/getTracksByCity/:city', async (req, res) => {
      console.log("Enter route(GET): /getTracksByCity");
      var city = req.params.city;

      try{
            let points = await findPointsByCity(city);
            let tracks = await findTracksByStartPoint(points);
            let results = await pushTracksToArrayNoRepeats(tracks);

            res.status(200).send(results);

      } catch(e){
            console.log("there was error in 'getTracksByCity' function!");
            console.log(e);
            res.status(400).send(e);
      }
});


/** 
    values required:
         trackId
**/
router.delete('/deleteTrack/:trackId', async (req, res) => {

      console.log("Enter route(GET): /deleteTrack");

      try {
            trackId = req.params.trackId;
            await deleteStartPoint(trackId);
            await deleteEndPoint(trackId);
            await deleteWayPoint(trackId);
            await deleteFavoriteTracksFromUsers(trackId);
            await deleteTrackRecordsFromUsers(trackId);
            await deleteSpecificTrack(trackId);

            res.status(200).send(`OK`);

      } catch (e) {
            res.status(500).send(`NOT OK`);
      }

});


/** 
    values required:
         city
**/
// once there is one point at 'startPoint' or 'endPoint' 
//from the same city and this track will be returned
router.get('/getTracksByCity/:from/:to/:type', async (req, res) => {
      console.log("Enter route(GET): /getTracksByCities");

      try{
            let startPoints = await findPointsByCity(req.params.from);
            let endPoints = await findPointsByCity(req.params.to);
            let tracks = await findTracksPoints(startPoints,endPoints);
            let tracksType = await filterTracksByType(tracks,req.params.type);
            let results = await pushTracksToArrayNoRepeats(tracksType);

            // Check if we got track list or not
            if(results.length <= 0) res.status(404).send({ "message": "No tracks found" });
            else res.status(200).send(results);

      } catch(e){
            console.log(e);
            res.status(400).send(e);
      }
});

/** ---------------------------- functions ---------------------------- */

var findTracksPoints = async (startPoints, endPoints) => {
      console.log("Entered findTracksPoints()");
      return new Promise((resolve, reject) => {
            var actions = Promise.all(startPoints.map(start => {
                  return new Promise((resolve, reject) => {
                        Track.find({ startPoint: start._id, endPoint: { $in: endPoints } }, (err, doc) => {
                              if (doc) resolve(doc);
                              if (err) reject(err);
                              else resolve(null);
                        })
                  })
            })
            );
            actions.then(data => {
                  resolve(data);
            })
      });
}

var filterTracksByType = async (tracks, type) => {

      let result = [];
      return new Promise((resolve, reject) => {
            console.log("Entered filterTracksByType()");
            if(tracks){
                  tracks.forEach( track => {
                        if( !(track.length == 0) ){
                              track.forEach(element => {
                                    // track not empty
                                    if(element.type == type) {
                                          console.log(`TRACK TYPE: ${element.type}`);
                                          // console.log(`push ${track} to result array in function: findTracksByPointId`);
                                          result.push(element);
                                    }
                              })
                        }
                  })
                  console.log(result);
                  resolve(result);
            }
            else
                  reject("something wrong in 'filterTracksByType' function");
      })
      
}


var getTrackById = async (trackId) => {
      console.log(`function: getTrackById => ${trackId}`);
      return Track.findOne({_id: trackId});
}

var getPoint = async (pointId) => {
      console.log(`function: getPoint => ${pointId}`);
      return Points.findById({_id: pointId});
}

var getPoints = async (pointsId) => {
      console.log(`function: getPoints => ${pointsId}`);
      let promises = [];

      pointsId.forEach( element => {
            promises.push(Points.findById({_id:element._id}));
      })
      return Promise.all(promises);
}

var getComments = async (commentsId) => {
      console.log(`function: getComments => ${commentsId}`);
      let results = [];
      let promises = [];

      commentsId.forEach( element => {
            promises.push(Comments.findById({_id:element._id}));
      })
      return Promise.all(promises);
}

var prepareResponse = async (_track, _startPoint, _endPoint, _wayPoints = [], _comments = []) => {
      return new Promise((resolve, reject) => {
            console.log("function: prepareResponse");
            result = new Object()
            result.track = _track;
            result.startPoint = _startPoint;  
            result.endPoint = _endPoint;  
            result.wayPoints = _wayPoints;
            result.comments = _comments;
            resolve(result);
      })
}

var findPointsByCity = async (city) => {
      return new Promise((resolve, reject) => {
            console.log("Entered findPointsByCity()");
            resolve(Points.find({city: city}).distinct('_id'));
      });
}

var findTracksByStartPoint = async (points) => {
      let promises = [];
      points.forEach( element => {
            promises.push(Track.find({startPoint: element._id}));
      })

      return Promise.all(promises);
}

var pushTracksToArrayNoRepeats = (tracks) => {
      let result = [];
      return new Promise((resolve, reject) => {
            console.log("Entered pushTracksToArrayNoRepeats()");
            if(tracks){
                  tracks.forEach( track => {
                        if( !(track.length == 0) ){
                              // track not empty
                              if(result.indexOf(track) === -1) {
                                    // console.log(`push ${track} to result array in function: findTracksByPointId`);
                                    result.push(track);
                              }
                        }
                  })
                  console.log(result);
                  resolve(result);
            }
            else
                  reject("something wrong in 'pushTracksToArrayNoRepeats' function");
      })
       
}

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

var deleteWayPoint = async (trackId) => {
      return new Promise((resolve, reject) => {
            console.log("function: deleteStartPoint");

            Track.findOne({
                  _id: trackId
            }, (err, res) => {
                  if (err) reject(err);

                  res.wayPoints.forEach((element) => {
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