var mongoose = require('mongoose');

var ReportsSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: String,
        required: true
    },
    report: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("ReportsSchema", ReportsSchema, "Reports");