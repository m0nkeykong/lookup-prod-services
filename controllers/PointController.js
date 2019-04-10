const express = require('express'),
      router = express.Router(),
      onlyNotEmpty = require('../controllers/OnlyNotEmpty'),
      PointSchema = require('../models/PointSchema');
bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/** 
    values required:
        type, title, startPoint-id, endPoint-id
    values can be null:
        middlePoint, comment, rating, diffucultyLevel, changesDuringTrack
**/
router.post('/insertPoint', (req, res) => {
      console.log("Enter route(POST): /insertPoint");

      const newPoint = new PointSchema(req.body);
      newPoint.save((err, doc) => {
            if (err) res.status(500).send(err);
            else if (doc) res.status(200).send(doc._id);
            else res.status(500).send("Error create point");
      });
});

/** 
    values required:
        id
**/
router.delete('/deletePointById/:id', (req, res) => {
      console.log("Enter route(DELETE): /deletePointById");

      // Find and remove point if exist
      PointSchema.findByIdAndRemove(req.params.id, (err, docs) => {
            if (err) return res.status(500).send(err);
            else if (docs) return res.status(200).send(docs);
            else res.status(500).send("Error delete point");
      });
});

module.exports = router;