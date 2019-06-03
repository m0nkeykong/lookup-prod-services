const express = require('express'),
      router = express.Router(),
      User = require('../models/UserSchema'),
      Track = require('../models/TrackSchema'),
      Points = require('../models/PointSchema'),
      Reports = require('../models/ReportsSchema'),
      onlyNotEmpty = require('../controllers/onlyNotEmpty'),
      bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/** 
    values required:
        type, title, startPoint-id, endPoint-id
**/
router.post('/insertTrack', (req, res) => {
      console.log("Enter route(POST): /insertTrack");
      console.log(req.body);
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
      console.log("Enter route(GET): /getTrackDetailsById");

      Track.findOne({
            _id: req.params.trackId
      }, (err, track) => {
            if (err) res.status(500).send(err);
            else if (track) res.status(200).send(track);
            else res.status(500).send("Error find track");
      });
});

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

            if( (track.reports.length !== 0) ) {
                  reports = await getReports(track.reports); 
                  console.log("reports:");
                  console.log(reports);
                  userDetails = await getUserDetailsOfEachReport(reports); 
                  console.log("userDetails:");
                  console.log(userDetails);
            }

            let result = await prepareResponse(track,startPoint,endPoint,wayPoints,reports,userDetails);
            return res.status(200).send(result); 
      } catch(e){
            res.status(400).send(e.message);
      }
        
});

// router.get('/getAllTracks', (req, res) => {
//       console.log("Enter route(GET): /getAllTracks");

//       Track.find({}, (err, tracks) => {
//             if (err) res.status(500).send(err);
//             else if (tracks) res.status(200).send(tracks);
//             else res.status(500).send("Error find tracks");
//       });
// });


async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

router.get('/getAllTracks', async (req, res) => {
      console.log("Enter route(GET): /getAllTracks");

      try{
            let wayPoints, result = [];
            let tracks = await getAllTracks();

            await asyncForEach(tracks, async (track) => {
                  let startPoint = await getPoint(track.startPoint);
                  let endPoint = await getPoint(track.endPoint); 

                  if( (track.wayPoints.length !== 0) ) {
                  wayPoints = await getPoints(track.wayPoints); 
                  console.log("MIDDLEEEEE:");
                  console.log(wayPoints);
                  }

                  result.push(await prepareResponseAllTracks(track,startPoint,endPoint,wayPoints));
                  console.log(startPoint);
                });
                console.log('Done');



            return res.status(200).send(result); 
      } catch(e){
            res.status(400).send(e.message);
      }
});


var getAllTracks = async () => {
      return Track.find({});
}

var prepareResponseAllTracks = async (_track, _startPoint, _endPoint, _wayPoints = []) => {
      return new Promise((resolve, reject) => {
            console.log("function: prepareResponseAllTracks");
            result = new Object()
            result.track = _track;
            result.startPoint = _startPoint;  
            result.endPoint = _endPoint;  
            result.wayPoints = _wayPoints;
            result.travelMode = _track.type;
            resolve(result);
      })
}

// router.put('/updateTrackStarsi/:trackId/:star', onlyNotEmpty, (req, res) => {
//       console.log("Enter route(PUT): /updateTrackStars");

//       Track.findOneAndUpdate({_id: req.params.trackId},
//             {$set: {difficultyLevel:{star:req.params.star}}})
//             .then((a) => {
//                   if(!a) throw 'Can not update a';
//                   res.status(200).send("updated"); 
//               });
// });

// Update Track by id
router.put('/updateTrack/:trackId', onlyNotEmpty, (req, res) => {
      console.log("Enter route(PUT): /updateTrack");

      Track.findByIdAndUpdate(req.params.trackId, req.bodyNotEmpty, (err, docs) => {
            if (err) return res.status(500).send(err);
            if (!docs) return res.status(404).send({
                  "Message": `Track ID was not found in the system`
            });
            // console.log(`User: ${docs.title} updated successfully`);
            res.status(200).send(docs);
      });
});

// // Update Track by id
// router.put('/updateTrackStars/:trackId/:star', onlyNotEmpty, (req, res) => {
//       console.log("Enter route(PUT): /updateTrackStars");

//       Track.find({_id: req.params.trackId})
//       .then((track, err) => {
//   	      if(err) res.status(400).send(err);
//              if(track){
//                   track[0].difficultyLevel.star = req.params.star
//                   track[0].difficultyLevel.countVotes = track[0].difficultyLevel.countVotes + 1 
//                   track[0].save((err, track) => {
//                         if(err) res.status(400).send(err);
//                         res.status(200).send(track);
//                   })
//       }
//       })
//       .catch(err => {
//             console.log(err);
//       }) 
// });


// Update Track by id
router.post('/updateTrackTimei/:trackId/:isDisable/:minutes', onlyNotEmpty, (req, res) => {
      console.log("Enter route(PUT): /updateTrackTimei");

      Track.find({_id: req.params.trackId})
      .then((track, err) => {
  	      if(err) res.status(400).send(err);
             if(track){
                  track[0].disabledTime.actual = req.params.minutes
                  track[0].disabledTime.count = track[0].disabledTime.count + 1 
                  track[0].nonDisabledTime.actual = req.params.minutes
                  track[0].nonDisabledTime.count = track[0].disabledTime.count + 1 
                  track[0].save((err, track) => {
                        if(err) res.status(400).send(err);
                        res.status(200).send(track);
                  })
      }
      })
      .catch(err => {
            console.log(err);
      }) 
});

// Update Track by id
router.put('/updateDefficultyLevel/:trackId/:star', onlyNotEmpty, (req, res) => {
      console.log("Enter route(PUT): /updateTrackStars");

      Track.find({_id: req.params.trackId})
      .then((track, err) => {
  	      if(err) res.status(400).send(err);
             if(track){
                   var mult = track[0].difficultyLevel.star * track[0].difficultyLevel.countVotes;
                   var plus = mult + parseInt(req.params.star);
                   var votesPlusOne = track[0].difficultyLevel.countVotes + 1;
                   var dividing = plus / votesPlusOne;
                  track[0].difficultyLevel.star = dividing
                  track[0].difficultyLevel.countVotes = track[0].difficultyLevel.countVotes + 1 
                  track[0].save((err, track) => {
                        if(err) res.status(400).send(err);
                        res.status(200).send(track);
                  })
      }
      })
      .catch(err => {
            console.log(err);
      }) 
});


// Update Track by id
router.put('/updateTrackTime/:trackId/:isDisable/:minutes', onlyNotEmpty, (req, res) => {
      console.log("Enter route(PUT): /updateTrackTime");

      // TODO: continue when i know about time type of google.
      if(req.params.isDisable == "true"){
            // the user is disabled
            Track.find({_id: req.params.trackId})
            .then((track, err) => {
                    if(err) res.status(400).send(err);
                   if(track){
                         var mult = track[0].disabledTime.actual * track[0].disabledTime.count;
                         var plus = mult + parseInt(req.params.minutes);
                         var votesPlusOne = track[0].disabledTime.count + 1;
                         var dividing = plus / votesPlusOne;
                        track[0].disabledTime.actual = dividing
                        track[0].disabledTime.count = track[0].disabledTime.count + 1 
                        track[0].save((err, track) => {
                              if(err) res.status(400).send(err);
                              res.status(200).send(track);
                        })
            }
            })
            .catch(err => {
                  console.log(err);
            }) 
      } else {
            // the user is not disabled
            Track.find({_id: req.params.trackId})
            .then((track, err) => {
                    if(err) res.status(400).send(err);
                   if(track){
                         console.log(track);
                         var mult = track[0].nonDisabledTime.actual * track[0].nonDisabledTime.count;
                         console.log(mult);
                         var plus = mult + parseInt(req.params.minutes);
                         console.log(plus);
                         var votesPlusOne = track[0].nonDisabledTime.count + 1;
                         console.log(votesPlusOne);
                         var dividing = plus / votesPlusOne;
                         console.log(dividing);
                        track[0].nonDisabledTime.actual = dividing
                        track[0].nonDisabledTime.count = track[0].nonDisabledTime.count + 1 
                        track[0].save((err, track) => {
                              if(err) res.status(400).send(err);
                              res.status(200).send(track);
                        })
            }
            })
            .catch(err => {
                  console.log(err);
            }) 
      }
});

// find track by id and push report to reports array
/**
 * values required:
 *    trackId, reportId
 */
router.post('/addReportToTrack', (req, res) => {
      console.log("Enter route(PUT): /addReportToTrack");

      Track.findByIdAndUpdate({_id: req.body.trackId}, {$push: {"reports": req.body.reportId}}, (err,track)=>{
            if (err) return res.status(500).send(err);
            if (!track) return res.status(404).send({
                  "Message": `Track ID was not found in the system`
            });
            res.status(200).send(track);
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

// /** 
//     values required:
//          city
// **/
// // once there is one point at 'startPoint' or 'endPoint' 
// //from the same city and this track will be returned
// router.get('/getTracksByCity/:from/:to/:type', async (req, res) => {
//       console.log("Enter route(GET): /getTracksByCities");

//       try{
//             let startPoints = await findPointsByCity(req.params.from);
//             let endPoints = await findPointsByCity(req.params.to);
//             let tracks = await findTracksPoints(startPoints,endPoints);
//             let tracksType = await filterTracksByType(tracks,req.params.type);
//             let results = await pushTracksToArrayNoRepeats(tracksType);

//             // Check if we got track list or not
//             if(results.length <= 0) res.status(404).send({ "message": "No tracks found" });
//             else res.status(200).send(results);

//       } catch(e){
//             console.log(e);
//             res.status(400).send(e);
//       }
// });

/** 
    values required:
         from, to, type, diffLevel
**/
// once there is one point at 'startPoint' or 'endPoint' 
//from the same city and this track will be returned
router.get('/getTracksByCity/:from/:to/:type/:diffLevel', async (req, res) => {
      console.log("Enter route(GET): /getTracksByCity/:from/:to/:type/:diffLevel");

      try{

            let startPoints = await findPointsByCity(req.params.from);
            let endPoints = await findPointsByCity(req.params.to);
            let tracks = await findTracksPoints(startPoints,endPoints);
            let tracksType = await filterTracksByType(tracks,req.params.type);
            let tracksFinal = await filterTracksByDiffLevel(tracksType,req.params.diffLevel);
            let results = await pushTracksToArrayNoRepeats(tracksFinal);

            console.log("~~~~~~~~~~~~~~~~~ E + N + D ~~~~~~~~~~~~~~~~~");
            // Check if we got track list or not
            if(results.length <= 0) res.status(404).send({ "message": "No tracks found" });
            else res.status(200).send(results);

      } catch(e){
            console.log(e);
            res.status(400).send(e);
      }
});

/** 
    values required:
         from, to, type, diffLevel
**/
// once there is one point at 'startPoint' or 'endPoint' 
//from the same city and this track will be returned
router.get('/getTracksFilter/:from/:to/:type/:diffLevel/:isDisabled', async (req, res) => {
      console.log("Enter route(GET): /getTracksFilter/:from/:to/:type/:diffLevel/:isDisabled");

      try{

            let startPoints = await findPointsByCity(req.params.from);
            let endPoints = await findPointsByCity(req.params.to);
            let tracks = await findTracksPoints(startPoints,endPoints);
            let tracksType = await filterTracksByType(tracks,req.params.type);
            let tracksFinal = await filterTracksByDiffLevel(tracksType,req.params.diffLevel);
            let filterNoRepeat = await pushTracksToArrayNoRepeats(tracksFinal);
            let TracksResults = await filterTrackByDisabled(req.params.isDisabled,filterNoRepeat);


            console.log("~~~~~~~~~~~~~~~~~ E + N + D ~~~~~~~~~~~~~~~~~");
            // Check if we got track list or not
            if(TracksResults.length <= 0) res.status(404).send({ "message": "No tracks found" });
            else res.status(200).send(TracksResults);

      } catch(e){
            console.log(e);
            res.status(400).send(e);
      }
});

/** ---------------------------- functions ---------------------------- */

var filterTrackByDisabled = async (isDisabled,tracks) => {
      console.log("Entered filterTrackByDisabled()");
      let result = [];

      return new Promise((resolve, reject) => {
            if(isDisabled == "true" && tracks){
                  tracks.forEach( track => {
                        if( !(track.length == 0) ){
                              // track not empty
                              console.log("TRASE:");
                              console.log(track);
                              // get the tracks whose difficulty level is below 3
                              if(track.difficultyLevel.star <= 3) {
                                    // console.log(`push ${track} to result array in function: findTracksByPointId`);
                                    result.push(track);
                              }
                        }
                  })
                  console.log(result);
                  resolve(result);
            }
            else
                  resolve(tracks);

            // if(tracks){
            //       tracks.forEach( track => {
            //             if( !(track.length == 0) ){
            //                   // track not empty
            //                   if(result.indexOf(track) === -1) {
            //                         // console.log(`push ${track} to result array in function: findTracksByPointId`);
            //                         result.push(track);
            //                   }
            //             }
            //       })
            //       console.log(result);
            //       resolve(result);
            // }
            // else
            //       reject("something wrong in 'pushTracksToArrayNoRepeats' function");
      })
}

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

var filterTracksByDiffLevel = async (tracks, difficultyLevel) => {

      let result = [];

      return new Promise((resolve, reject) => {
            console.log("Entered filterTracksByDiffLevel()");
            if(difficultyLevel != "NO" && tracks){
                  console.log("TRACKKKKKKKSSSSSSSSSSSSSSS::::::");
                  console.log(tracks);
                  for (let i = 0; i < tracks.length ; ++i){
                        if( !(tracks.length == 0) ){
                              console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
                              console.log(tracks[i].difficultyLevel );
                              let diffNumber = Math.round(tracks[i].difficultyLevel.star);
                              console.log("Q:");
                              console.log(diffNumber);
                              if(diffNumber == difficultyLevel) {
                                    result.push(tracks[i]);
                              }
                        }
                  }
                  // tracks.forEach( track => {
                  //       if( !(track.length == 0) ){
                  //             track.forEach(element => {
                  //                   // track not empty
                  //                   if(element.difficultyLevel == difficultyLevel) {
                  //                         console.log(`TRACK difficultyLevel: ${element.difficultyLevel}`);
                  //                         result.push(element);
                  //                   }
                  //             })
                  //       }
                  // })
                  console.log(result);
                  resolve(result);
            }
            else
                  resolve(tracks);
      })
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

var getReports = async (reportsId) => {
      console.log(`function: getReports => ${reportsId}`);
      let promises = [];

      reportsId.forEach( element => {
            promises.push(Reports.findById({_id:element._id}));
      })
      return Promise.all(promises);
}

var getUserDetailsOfEachReport = async (reportsId) => {
      console.log(`function: getUserDetailsOfEachReport => ${reportsId}`);
      let promises = [];

      reportsId.forEach( element => {
            promises.push(User.findById({_id:element.userId}));
      })
      return Promise.all(promises);
}

var prepareResponse = async (_track, _startPoint, _endPoint, _wayPoints = [], _reports = [], _userDetails = []) => {
      return new Promise((resolve, reject) => {
            console.log("function: prepareResponse");
            result = new Object()
            result.track = _track;
            result.startPoint = _startPoint;  
            result.endPoint = _endPoint;  
            result.wayPoints = _wayPoints;
            result.travelMode = _track.type;
            result.reports = _reports;
            result.userDetails = _userDetails;
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