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
      newTrack.save(err => {
            if (err) return res.status(500).send(err);
            console.log(`Track ${req.body.title} has been created successfully`);
            res.status(200).send(`Track ${req.body.title} has been created successfully`);
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
            if (err) return res.status(500).send(err);
            else if (track) return res.status(200).send(track);
            else return res.status(500).send(config.errors.ERROR_FIND_TRACK);
      });
});


module.exports = router;