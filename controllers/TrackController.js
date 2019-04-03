const mongoose          = require('mongoose');
      // schemas:
var   User              = require('../models/UserSchema');
      Track             = require('../models/TrackSchema');
      Points            = require('../models/PointSchema');
      config            = require('../config');

/************************** ROUTE: insertTrack **************************/

exports.insertTrack = (req,res)=>{
  
      console.log("Enter route(POST): /insertTrack");
      const newTrack = new Track(req.body);
      newTrack.save(err => {
            if (err){
              console.log(err);
              return res.status(500).send(err);
            }
            console.log(`Track ${req.body.title} has been created successfully`);
            res.status(200).send(`Track ${req.body.title} has been created successfully`);
      });
};


/************************** ROUTE: getTrackByTitle **************************/

exports.getTrackByTitle = (req,res)=>{
  
      console.log("Enter route(GET): /getTrackByTitle");

      Track.findOne({title:req.params.title}, (err, track) => {
            if (err) {
              console.log(err);
              return res.status(500).send(err);
            }
            else if(track)
                  return res.status(200).send(track);        
            else
                  return res.status(500).send(config.errors.ERROR_FIND_TRACK);
        });
    
};

/************************** ROUTE: getAllTracks **************************/

exports.getAllTracks = (req,res)=>{
  
      console.log("Enter route(GET): /getAllTracks");

      Track.find({}, (err, tracks) => {
            if (err) {
              console.log(err);
              return res.status(500).send(err);        
            }
            else if(tracks){
                  return res.status(200).send(tracks);        
            }
        });
    
};


/************************** ROUTE: deleteTrackBytitle **************************/

exports.deleteTrackBytitle = (req, res) => {

//       console.log("Enter route(DELETE): /deleteTrackBytitle");

//       Track.findOne({title:req.params.title}, (err, track) => {
//             if (err) {
//               res.status(500).send(err);
//             }
//             else if(track){
//                   // remove startPoint
//                   // Points.findByIdAndRemove(track.startPoint._id,(err,doc) => {
//                   //       if(err)
//                   //             res.status(500).send(err);
//                   // });
//                   // // remove endPoint                  
//                   // Points.findByIdAndRemove(track.endPoint._id,(err,doc) => {
//                   //       if(err)
//                   //             res.status(500).send(err);
//                   // });
//                   // // remove all middle Points 
//                   // track.middlePoint.forEach((element)=>{
//                   //       Points.findByIdAndRemove(element,(err,doc) => {
//                   //             if(err)
//                   //                   res.status(500).send(err);
//                   //       });
//                   // })
//                   // find all users that have this track in "favoriteTracks" array and "trackRecords" array
           
           
//                   // User.findByIdAndUpdate(id_,
//                   //       {$pull: {participents: _userName}},
//                   //       {safe: true, upsert: true},
//                   //       (err, doc) =>{
//                   //           if(err){
//                   //           console.log(err);
//                   //           resolve({});
//                   //           }else{
//                   //             console.log(`The user ${_userName} is deleted from ${doc.name} Subject.`);
//                   //             resolve(doc);
//                   //           }
//                   //       }
//                   //     );

                       
//             User.find({favoriteTracks:track._id}, (err, user) => {
//                   user.forEach((usr)=>{
//                         console.log("usr:");
//                         console.log(usr); // do 3 times
                        
//                         User.deleteOne()

//                         // usr.favoriteTracks.forEach((element)=>{
//                         //       console.log("element:");
//                         //       console.log(element);   // all elements not specific what i searched
//                         // })

//                         // deleteTrackFromUsers(usr._id).then((result,err)=>{
//                         //       if(err)
//                         //             res.status(500).send(config.errors.ERROR_DELETE_TRACK_USER);
//                         //       res.status(200).send(result);
//                         // })

//                         // User.findByIdAndRemove({favoriteTracks:track._id}, (err,doc)=>{
//                         //       if(err)
//                         //             res.status(500).send(config.errors.ERROR_DELETE_TRACK_USER);
//                         //       console.log("DOC:");
//                         //       console.log(doc);
//                         // });
//                   })
//             });

         
//               }
//             else
//                   res.status(500).send(config.errors.ERROR_DELETE_TRACK);
//             });
//       res.status(200).send("OK");
            
};


// var deleteTrackFromUsers = (id_) => {
  
//       return new Promise((resolve, reject)=> {
//             console.log("function: deleteTrackFromUsers");
       
//             User.findByIdAndUpdate(id_,
//                   {$pull: {favoriteTracks: id_}},
//                   {safe: true, upsert: true},
//                   (err, doc) =>{
//                       if(err){
//                             console.log(err);
//                             resolve({});
//                       }
//                       console.log("DIC:");
//                       console.log(doc);
//                   }
//                 );
     
//         });
//     }; 
  
//     var deleteUserFromSubjectByUserName_UserSchema = (_userName,id_) => {
  
//       return new Promise((resolve, reject)=> {
//         console.log(`_userName,id_: ${_userName,id_}`);
    
//         Subject.findByIdAndUpdate(id_,
//           {$pull: {participents: _userName}},
//           {safe: true, upsert: true},
//           (err, doc) =>{
//               if(err){
//               console.log(err);
//               resolve({});
//               }else{
//                 console.log(`The user ${_userName} is deleted from ${doc.name} Subject.`);
//                 resolve(doc);
//               }
//           }
//         );
    
//       });
//     };
