const   express = require('express'),
        router = express.Router(),
        onlyNotEmpty = require('./OnlyNotEmpty'),
        CommentSchema = require('../models/CommentsSchema');
        bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
      extended: true
}));

/** 
    values required:
        type, title, startPoint-id, endPoint-id
    values can be null:
        wayPoints, comments, rating, diffucultyLevel, changesDuringTrack
**/
router.post('/insertComment', (req, res) => {
      console.log("Enter route(POST): /insertComment");

      const newComment = new CommentSchema(req.body);
      newComment.save((err, doc) => {
            if (err) res.status(500).send(err);
            else if (doc) res.status(200).send(doc._id);
            else res.status(500).send("Error create comment");
      });
});

/** 
    values required:
        id
**/
router.delete('/deleteCommentById/:id', (req, res) => {
      console.log("Enter route(DELETE): /deleteCommentById");

      // Find and remove point if exist
      CommentSchema.findByIdAndRemove(req.params.id, (err, docs) => {
            if (err) return res.status(500).send(err);
            else if (docs) return res.status(200).send(docs);
            else res.status(500).send("Error delete point");
      });
});

/** 
    values required:
        id
**/
router.get('/getCommentById/:id', (req, res) => {
      console.log("Enter route(GET): /getCommentsById");
     
      //Find and remove point if exist
      CommentSchema.findById(req.params.id, (err, docs) => {
            if (err) return res.status(500).send(err);
            else if (docs) return res.status(200).send(docs);
            else res.status(500).send("Error delete point");
      });
});

module.exports = router;