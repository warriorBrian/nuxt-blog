const mongoose = require('mongoose');
const db = require('./db');

let commentSchema = new mongoose.Schema({
    id: String,
    title: String,
    comment: []
});

let commentModel = db.model('comment',commentSchema);

module.exports = commentModel;
