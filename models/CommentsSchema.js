var mongoose = require('mongoose');

var CommentsSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("CommentsSchema", CommentsSchema, "Comments");