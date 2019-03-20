const express = require('express'),
      router = express.Router(),
      User = require('../models/UserSchema'),
      Track = require('../models/TrackSchema'),
      BLE = require('../models/BLESchema'),
      settings = require('../config'),
      onlyNotEmpty = require('../controllers/onlyNotEmpty'), 
      bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


// Return all the users in the database
router.get('/getAllAccounts', (req, res) => {
      User.find({}, (err, users) => {
            // Problem with user schema
            if (err) return res.status(500).send({ "message": "There was a problem finding the users." });
            // There is no users in the system
            if (!users) return res.status(404).send({ "message": "No user found" });
            // Return the found users
            res.status(200).send(users);
      });
});

/*  */
// Get Specific user data by id
router.get('/getAccountDetails/:userid', (req, res) => {
      User.findById(req.params.userid, (err, user) => {
            // Problem with user schema
            if (err) return res.status(500).send({ "message": "There was a problem finding the user." });
            // User not found
            if (!user) return res.status(404).send({ "message": "No user found" });
            // Return the found user
            res.status(200).send(user);
      });
});

// Login with existing user or new user
router.get('/getAccountDetailsByEmail/:email', (req, res) => {
      // Find existing user by email
      User.findOne({ email: { email: { $eq: req.params.email } } }, (err, user) => {
            // User is not existing in data base
            if (err) {
                  // Create new user with REQUIRED Parameters
                  if (req.params.email && req.body.name && req.body.birthDay && req.body.profilePicture) {
                        let userDetails = {
                              email: req.params.email,
                              name: req.body.name,
                              birthDay: req.body.birthDay,
                              profilePicture: req.body.profilePicture,
                        }
                        // Create the document
                        User.Create(userDetails, (err, user) => {
                              if (err) return res.status(500).send({ "message": "There was a problem finding the user." });
                              if (!user) return res.status(404).send({ "message": "No user found" });
                              // Return the new created user
                              res.status(200).send(user);
                        })
                  }
                  // Cannot create new user
                  return res.status(500).send({ "message": "There was a problem creating the user, one of parameters not defined" }, { userDetauls });
            }
            // Return the existing user    
            res.status(200).send(user);
      });
});

// Create New User
router.post('/createAccount', (req, res) => {
      const newUser = new User(req.body);
      newUser.save(err => {
            if (err) return res.status(500).send({ "Message": "Internal server error" });
            console.log(`Account ${req.body.email} has been created successfully`);
            res.status(200).send(`Acount ${req.body.email} has been created successfully`);
      });
});

// Update user account by id
router.put('/updateAccountDetails/:userid', onlyNotEmpty, (req, res) => {
      // Find and update user accounnt
      User.findByIdAndUpdate(req.params.userid, req.bodyNotEmpty, (err, docs) => {
            if (err) return res.status(500).send({ "Message": `User ID was not found in the system` });
            if (!docs) return res.status(404).send({ "message": "No user found" });
            console.log(`User: ${docs.name} updated successfully`);
            res.status(200).send(docs);
      });
});

// Delete user account
router.delete('/deleteAccount/:userid', (req, res) => {
      // Find and remove account if existing
      User.findByIdAndRemove(eq.params.userid, (err, docs) => {
            if (err) return res.status(400).send({ "Message": `User ID was not found in the system` });
            if (!docs) return res.status(404).send({ "message": "No user found" });
            console.log(`User: ${docs.name} deleted successfully`);
            res.status(200).send(docs);
      });
});

// Add new favorite track to user tracks list
router.put('/addFavoriteTrack/:userid', (req, res) => {
      // Check if track already existing in user favorite list
      User.find({
            $and: [
                  { _id: req.params.userid },
                  { "favoriteTracks": { $elemMatch: { $in: req.body.trackid } } }
            ]
      }, (err, user) => {
            if (err) return res.status(500).send({ "message": "There was a problem searching" });
            if (user) return res.status(404).send({ "message": "Track already existing in favorite tracks list" });
            // Find user and update his favoriteTracks list
            User.findByIdAndUpdate(req.params.id, { $push: { "favoriteTracks": req.body.trackid } }, { new: true }, (err, newuser) => {
                  if (err) return res.status(400).send({ "Message": `User ID was not found in the system` });
                  console.log(`Track ${req.body.trackid} was added successfully to user: ${newuser.name} favorite list`);
                  res.status(200).send(newuser);
            })
      });
});

// Remove existing favorite track from user tracks list
router.put('/removeFavoriteTrack/:userid', (req, res) => {
      // Check if track already existing in user favorite list
      User.find({
            $and: [
                  { _id: req.params.userid },
                  { "favoriteTracks": { $elemMatch: { $in: req.body.trackid } } }
            ]
      }, (err, user) => {
            if (err) return res.status(500).send({ "message": "There was a problem searching" });
            if (!user) return res.status(404).send({ "message": "Track is not existing in favorite tracks list" });
            // Find user and update his favoriteTracks list
            User.findByIdAndUpdate(req.params.id, { $pull: { "favoriteTracks": req.body.trackid } }, { new: true }, (err, newuser) => {
                  if (err) return res.status(400).send({ "Message": `User ID was not found in the system` });
                  console.log(`Track ${req.body.trackid} was removed successfully from user: ${newuser.name} favorite list`);
                  res.status(200).send(newuser);
            })
      });
});

// Get user's full favorite track list
router.get('/getFavoriteTracksList/:userid', (req, res) => {
      // Search for given user docuemnt
      User.findById(req.params.userid, (err, user) => {
            // Problem with user schema
            if (err) return res.status(500).send({ "message": "There was a problem finding the user." });
            // User not found
            if (!user) return res.status(404).send({ "message": "No user found" });
            // Return the found user
            res.status(200).send(user.favoriteTracks);
      });
});

// Add new track record to user track records list
router.get('/addTrackRecord/:userid', (req, res) => {
      // Check if track already existing in user records list
      User.find({
            $and: [
                  { _id: req.params.userid },
                  { "trackRecords": { $elemMatch: { $in: req.body.trackid } } }
            ]
      }, (err, user) => {
            if (err) return res.status(500).send({ "message": "There was a problem searching" });
            if (user) return res.status(404).send({ "message": "Track already existing in records tracks list" });
            // Find user and update his trackRecords list
            User.findByIdAndUpdate(req.params.id, { $push: { "trackRecords": req.body.trackid } }, { new: true }, (err, newuser) => {
                  if (err) return res.status(400).send({ "Message": `User ID was not found in the system` });
                  console.log(`Track ${req.body.trackid} was added successfully to user: ${newuser.name} records list`);
                  res.status(200).send(newuser);
            })
      });
});

// Remove track record
router.get('/removeTrackRecord/:userid', (req, res) => {
      // Check if track already existing in user records list
      User.find({
            $and: [
                  { _id: req.params.userid },
                  { "trackRecords": { $elemMatch: { $in: req.body.trackid } } }
            ]
      }, (err, user) => {
            if (err) return res.status(500).send({ "message": "There was a problem searching" });
            if (!user) return res.status(404).send({ "message": "Track is not existing in records tracks list" });
            // Find user and update his trackRecords list
            User.findByIdAndUpdate(req.params.id, { $pull: { "trackRecords": req.body.trackid } }, { new: true }, (err, newuser) => {
                  if (err) return res.status(400).send({ "Message": `User ID was not found in the system` });
                  console.log(`Track ${req.body.trackid} was removed successfully from user: ${newuser.name} records list`);
                  res.status(200).send(newuser);
            })
      });
});

// Get user's full track records list
router.get('/getTrackRecordsList/:userid', (req, res) => {
      // Search for given user docuemnt
      User.findById(req.params.userid, (err, user) => {
            // Problem with user schema
            if (err) return res.status(500).send({ "message": "There was a problem finding the user." });
            // User not found
            if (!user) return res.status(404).send({ "message": "No user found" });
            // Return the found user
            res.status(200).send(user.trackRecords);
      });
});

// Connect to BLE
router.put('/linkBLE/:useridid', (req, res) => {
      User.findByIdAndUpdate(req.params.id, { BLE: req.body.bleid }, { new: true }, (err, newuser) => {
            if (err) return res.status(400).send({ "Message": `User ID was not found in the system` });
            console.log(`BLE ${req.body.bleid} was linked successfully to user: ${newuser.name}`);
            res.status(200).send(newuser);
      })
});

// Disconnect from BLE
router.put('/unlinkBLE/:userid', (req, res) => {
      User.findByIdAndUpdate(req.params.id, { $unset: { words: 1 } }, { multi: true }, { new: true }, (err, newuser) => {
            if (err) return res.status(400).send({ "Message": `User ID was not found in the system` });
            console.log(`BLE ${req.body.bleid} was unlinked successfully to user: ${newuser.name}`);
            res.status(200).send(newuser);
      })
});

// Get current BLE Status
router.get('/getBLEStatus/:userid', (req, res) => {
      User.findById(req.params.userid, (err, user) => {
            // Problem with user schema
            if (err) return res.status(500).send({ "message": "There was a problem finding the user." });
            // User not found
            if (!user) return res.status(404).send({ "message": "No user found" });
            // Return the found user
            res.status(200).send(user.BLE);
      });
});

// checkCurrentLocationWithStartPoint
// Add Promises to all "UPDATE" functions

module.exports = router;