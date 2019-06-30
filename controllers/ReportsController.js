const   express = require('express'),
        router = express.Router(),
        ReportSchema = require('../models/ReportSchema');
        bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
      extended: true
}));

router.post('/insertReport', (req, res) => {
      console.log("Enter route(POST): /insertReport");

      const newReport = new ReportSchema(req.body);
      newReport.save((err, doc) => {
            if (err) res.status(500).send(err);
            else if (doc) res.status(200).send(doc._id);
            else res.status(500).send("Error create report");
      });
});

router.delete('/deleteReportById/:id', (req, res) => {
      console.log("Enter route(DELETE): /deleteReportById");

      // Find and remove point if exist
      ReportSchema.findByIdAndRemove(req.params.id, (err, docs) => {
            if (err) return res.status(500).send(err);
            else if (docs) return res.status(200).send(docs);
            else res.status(500).send("Error delete point");
      });
});

router.get('/getReportById/:id', (req, res) => {
      console.log("Enter route(GET): /getReportById");
     
      //Find and remove point if exist
      ReportSchema.findById(req.params.id, (err, docs) => {
            if (err) return res.status(500).send(err);
            else if (docs) return res.status(200).send(docs);
            else res.status(500).send("Error getting report");
      });
});

module.exports = router;