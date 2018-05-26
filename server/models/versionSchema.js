const mongoose = require('mongoose');
const db = require('./db');

let versionSchema = new mongoose.Schema({
	version:String,
	time:String,
	content:String
});

let versionModel = db.model('version',versionSchema);

module.exports = versionModel;
