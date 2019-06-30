var mongoose = require('mongoose');

var ReportSchema = new mongoose.Schema({
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

module.exports = mongoose.model("ReportSchema", ReportSchema, "Reports");