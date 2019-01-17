const mongoose = require('mongoose');
const db = require('./db');

let configSchema = new mongoose.Schema({
    author: [],
    status: Boolean
});

let configModel = db.model('commentConfig',configSchema);

module.exports = configModel;
