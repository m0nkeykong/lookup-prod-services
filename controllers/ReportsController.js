const   express = require('express'),
        router = express.Router(),
        ReportsSchema = require('../models/ReportsSchema');
        bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
      extended: true
}));

/** 
    values required:
        type, title, startPoint-id, endPoint-id
**/
router.post('/insertReport', (req, res) => {
      console.log("Enter route(POST): /insertReport");

      const newReport = new ReportsSchema(req.body);
      newReport.save((err, doc) => {
            if (err) res.status(500).send(err);
            else if (doc) res.status(200).send(doc._id);
            else res.status(500).send("Error create report");
      });
});

/** 
    values required:
        id
**/
router.delete('/deleteReportById/:id', (req, res) => {
      console.log("Enter route(DELETE): /deleteReportById");

      // Find and remove point if exist
      ReportsSchema.findByIdAndRemove(req.params.id, (err, docs) => {
            if (err) return res.status(500).send(err);
            else if (docs) return res.status(200).send(docs);
            else res.status(500).send("Error delete point");
      });
});

/** 
    values required:
        id
**/
router.get('/getReportById/:id', (req, res) => {
      console.log("Enter route(GET): /getReportById");
     
      //Find and remove point if exist
      ReportsSchema.findById(req.params.id, (err, docs) => {
            if (err) return res.status(500).send(err);
            else if (docs) return res.status(200).send(docs);
            else res.status(500).send("Error delete point");
      });
});

module.exports = router;