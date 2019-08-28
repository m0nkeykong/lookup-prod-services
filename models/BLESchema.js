var mongoose  = require('mongoose');

var BLESchema = new mongoose.Schema({
      id: mongoose.Schema.Types.ObjectId,
      deviceName: {type: String, required: true},
      writeData: {type: Number},
      readData: {type: Number}
    }
);

module.exports = mongoose.model("BLESceham", BLESchema, "BLE");