const mongoose          = require('mongoose');
      // schemas:
var   Track             = require('../models/TrackSchema');
var   PointSchema     = require('../models/PointSchema');

/************************** ROUTE: insertPoint **************************/

exports.insertPoint = (req,res)=>{
  
      console.log("Enter route(POST): /insertPoint");
      // console.log(req.body);
      // res.status(200).send(`try to do my best`);
      
      const newPoint = new PointSchema(req.body);
      newPoint.save((err,doc) => {
            if (err){
              console.log(err);
              return res.status(500).send({ "Message": "Internal server error" });
            }
            console.log(`Ponint has been created successfully`);
            res.status(200).send(doc._id);
      });
};

////////////////////////////////////////////////////////////////////////////////////


/************************** ROUTE: deletePointById **************************/

exports.deletePointById = (req, res) => {

      console.log("Enter route(DELETE): /deletePointById");
      res.status(200).send("OK");

};


////////////////////////////////////////////////////////////////////////////////////