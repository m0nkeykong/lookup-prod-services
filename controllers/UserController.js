const express = require('express'),
      router = express.Router(),
      User = require('../models/UserSchema'),
      Track = require('../models/TrackSchema'),
      BLE = require('../models/BLESchema'),
      settings = require('../config'),
      onlyNotEmpty = require('../controllers/OnlyNotEmpty'), 
      bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Return all the users in the database
router.get('/getAllAccounts', (req, res) => {
      console.log(`Entered getAllAccounts`);
      User.find({}, (err, users) => {
            // Problem with user schema
            if (err) return res.status(500).send(err);
            // There is no users in the system
            if (!users) return res.status(404).send({ "message": "No user found" });
            // Return the found users
            res.status(200).send(users);
      });
});

// Get Specific user data by id
router.get('/getAccountDetails/:userid', (req, res) => {
      console.log(`Entered getAccountDetails`);
      User.findById(req.params.userid, (err, user) => {
            // Problem with user schema
            if (err) return res.status(500).send(err);
            // User not found
            if (!user) return res.status(404).send({ "message": "No user found" });
            // Return the found user
            res.status(200).send(user);
      });
});

// Login with existing user or new user
router.post('/getAccountDetailsByEmail/:email', (req, res) => {
      console.log(`Entered getAccountDetailsByEmail`);
      // Find existing user by email
      console.log("hello");
      var userDetails;
      User.findOne({ email: req.params.email }, (err, user) => {
            // User is not existing in data base
            if (!user) {
                  // Create new user with REQUIRED Parameters
                  if (req.params.email && req.body.name && req.body.imageUrl) {
                        userDetails = {
                              email: req.params.email,
                              name: req.body.name,
                              profilePicture: req.body.imageUrl,
                              createdDate: new Date().getTime()
                        }
                        console.log(userDetails);
                        // Create the document
                        User.create(userDetails, (err, newUser) => {
                              if (err) return res.status(500).send(err);
                              if (!newUser) return res.status(404).send({ "message": "No user found" });
                              // Return the new created user
                              console.log("create");
                              res.status(200).send(newUser);
                        })
                  }
                  // Cannot create new user
                  else return res.status(500).send({ "message": "There was a problem creating the user, one of parameters not defined" });
            }
            else{
                  // Return the existing user   
                  console.log("create2"); 
                  return res.status(200).send(user);
            }
      });
});

// Create New User
router.post('/createAccount', (req, res) => {
      console.log(`Entered createAccount`);
      const newUser = new User(req.body);
      newUser.save(err => {
            if (err) return res.status(500).send(err);
            console.log(`Account ${req.body.email} has been created successfully`);
            res.status(200).send(`Acount ${req.body.email} has been created successfully`);
      });
});

// Update user account by id
router.put('/updateAccountDetails/:userid', onlyNotEmpty, (req, res) => {
      console.log(`Entered updateAccountDetails`);
      // Find and update user accounnt
      console.log(req.params);
      User.findByIdAndUpdate(req.params.userid, req.bodyNotEmpty, (err, docs) => {
            if (err) return res.status(500).send(err);
            if (!docs) return res.status(404).send({ "message": "No user found" });
            console.log(`User: ${docs.name} updated successfully`);
            res.status(200).send(docs);
      });
});

// Delete user account
router.delete('/deleteAccount/:userid', (req, res) => {
      console.log(`Entered deleteAccount`);
      // Find and remove account if existing
      User.findByIdAndRemove(eq.params.userid, (err, docs) => {
            if (err) return res.status(400).send(err);
            if (!docs) return res.status(404).send({ "message": "No user found" });
            console.log(`User: ${docs.name} deleted successfully`);
            res.status(200).send(docs);
      });
});

// Add new favorite track to user tracks list
router.put('/addFavoriteTrack/:userid', (req, res) => {
      console.log(`Entered addFavoriteTrack`);
      // Check if track already existing in user favorite list
      User.findOne({
            $and: [
                  { _id: req.params.userid },
                  { "favoriteTracks": { $elemMatch: { $in: [req.body.trackid] } } }
            ]
      }, (err, user) => {
            if (err) return res.status(500).send(err);
            if (user) return res.status(404).send({ "message": "Track already existing in favorite tracks list" });
            // Find user and update his favoriteTracks list
            User.findByIdAndUpdate(req.params.id, { $push: { "favoriteTracks": req.body.trackid } }, { new: true }, (err, newuser) => {
                  if (err) return res.status(400).send(err);
                  console.log(`Track ${req.body.trackid} was added successfully to user: ${newuser.name} favorite list`);
                  res.status(200).send(newuser);
            })
      });
});

// Remove existing favorite track from user tracks list
router.put('/removeFavoriteTrack/:userid', (req, res) => {
      console.log(`Entered removeFavoriteTrack`);
      // Check if track already existing in user favorite list
      User.findOne({
            $and: [
                  { _id: req.params.userid },
                  { "favoriteTracks": { $in: [req.body.trackid] } }
            ]
      }, (err, user) => {
            if (err) return res.status(500).send(err);
            if (!user) return res.status(404).send({ "message": "Track is not existing in favorite tracks list" });
            // Find user and update his favoriteTracks list
            User.findByIdAndUpdate(req.params.id, { $pull: { "favoriteTracks": req.body.trackid } }, { new: true }, (err, newuser) => {
                  if (err) return res.status(400).send(err);
                  console.log(`Track ${req.body.trackid} was removed successfully from user: ${newuser.name} favorite list`);
                  res.status(200).send(newuser);
            })
      });
});

// Get user's full favorite track list
router.get('/getFavoriteTracksList/:userid', (req, res) => {
      console.log(`Entered getFavoriteTracksList`);
      // Search for given user docuemnt
      User.findById(req.params.userid, (err, user) => {
            // Problem with user schema
            if (err) return res.status(500).send(err);
            // User not found
            if (!user) return res.status(404).send({ "message": "No user found" });
            // Return the found user
            res.status(200).send(user.favoriteTracks);
      });
});

// Add new track record to user track records list
router.put('/addTrackRecord/:userid', (req, res) => {
      console.log(`Entered addTrackRecord`);
      // Check if track already existing in user records list
      User.findOne({
            $and: [
                  { _id: req.params.userid },
                  // { "trackRecords": {$elemMatch: {$in: [req.body.trackid]}} }
                  { "trackRecords": {$in: [req.body.trackid]} }
            ]
      }, (err, user) => {
            if (err) return res.status(500).send(err);
            if (user) return res.status(404).send({ "message": "Track already existing in records tracks list" + user});
            // Find user and update his trackRecords list
            User.findByIdAndUpdate(req.params.userid, { $push: { "trackRecords": req.body.trackid } }, { new: true }, (err, newuser) => {
                  if (err) return res.status(400).send(err);
                  console.log(`Track ${req.body.trackid} was added successfully to user: ${newuser.name} records list`);
                  res.status(200).send(newuser);
            })
      });
});

// Remove track record
router.put('/removeTrackRecord/:userid', (req, res) => {
      console.log(`Entered removeTrackRecord`);
      // Check if track already existing in user records list
      User.findOne({
            $and: [
                  { _id: req.params.userid },
                  { "trackRecords": { $in: [req.body.trackid] } }
            ]
      }, (err, user) => {
            if (err) return res.status(500).send(err);
            if (!user) return res.status(404).send({ "message": "Track is not existing in records tracks list" });
            // Find user and update his trackRecords list
            User.findByIdAndUpdate(req.params.id, { $pull: { "trackRecords": req.body.trackid } }, { new: true }, (err, newuser) => {
                  if (err) return res.status(400).send(err);
                  console.log(`Track ${req.body.trackid} was removed successfully from user: ${newuser.name} records list`);
                  res.status(200).send(newuser);
            })
      });
});

// Get user's full track records list
router.get('/getTrackRecordsList/:userid', (req, res) => {
      console.log(`Entered getTrackRecordsList`);
      // Search for given user docuemnt
      User.findById(req.params.userid, (err, user) => {
            // Problem with user schema
            if (err) return res.status(500).send(err);
            // User not found
            if (!user) return res.status(404).send({ "message": "No user found" });
            // Return the found user
            res.status(200).send(user.trackRecords);
      });
});

// Connect to BLE
router.put('/linkBLE/:userid', (req, res) => {
      console.log(`Entered linkBLE`);
      User.findByIdAndUpdate(req.params.id, { BLE: req.body.bleid }, { new: true }, (err, newuser) => {
            if (err) return res.status(400).send(err);
            console.log(`BLE ${req.body.bleid} was linked successfully to user: ${newuser.name}`);
            res.status(200).send(newuser);
      })
});

// Disconnect from BLE
router.put('/unlinkBLE/:userid', (req, res) => {
      console.log(`Entered unlinkBLE`);
      User.findByIdAndUpdate(req.params.id, { $unset: { words: 1 } }, { multi: true }, { new: true }, (err, newuser) => {
            if (err) return res.status(400).send(err);
            console.log(`BLE ${req.body.bleid} was unlinked successfully to user: ${newuser.name}`);
            res.status(200).send(newuser);
      })
});

// Get current BLE Status
router.get('/getBLEStatus/:userid', (req, res) => {
      console.log(`Entered getBLEStatus`);
      User.findById(req.params.userid, (err, user) => {
            // Problem with user schema
            if (err) return res.status(500).send(err);
            // User not found
            if (!user) return res.status(404).send({ "message": "No user found" });
            // Return the found user
            res.status(200).send(user.BLE);
      });
});

// Update User Rank
router.put('/rankUpdate/:userid', (req, res) => {
      console.log(`Entered rankUpdate`);
      User.findById(req.params.userid, (err, user) => {
            if (err) return res.status(400).send(err);
            // Calculating distance factor
            const dis = parseInt(req.body.totalDistance) + parseInt(user.totalDistance);

            const userid = req.params.id;
            console.log(`Now updating ${userid} Rank, totalDistance to be updated: ${dis}`);

            // Switch to case and update the rank
            switch (true){
                  case (dis>=0 && dis<=10000):
                        updateRankAndDistance(userid, dis, 0, res);
                        break;
                  
                  case (dis>10000 && dis<=20000):
                        updateRankAndDistance(userid, dis, 1, res);
                        break;
                  
                  case (dis>20000 && dis<=35000):
                        updateRankAndDistance(userid, dis, 2, res);
                        break;
                  
                  case (dis>35000 && dis<=50000):
                        updateRankAndDistance(userid, dis, 3, res);
                        break;
                  
                  case (dis>50000):
                        updateRankAndDistance(userid, dis, 4, res);
                        break;

                  default:
                        console.log("Entered default case");
                        res.status(500).send(user);
                        break;
            }
      })
});

const updateRankAndDistance = (userid, distance, rank, res) => {
      console.log(`Entered updateRankAndDistance`);
      User.findOneAndUpdate(userid, { totalDistance: distance, rank: rank }, (err, newuser) => {
            if (err) return res.status(400).send(err);
            console.log(`User ${newuser._id} rank is ${newuser.rank} and totalDistance is ${newuser.totalDistance}, Updated successfully`);
            res.status(200).send(newuser);
      })
}

// Add Promises to all "UPDATE" functions

module.exports = router;