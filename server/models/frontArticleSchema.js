const mongoose = require('mongoose');
const db = require('./db');

let articleSchema = new mongoose.Schema({
	title:String,
	time:String,
	content:String,
	original:String,
	des:String,
	list:String
});

let articleModel = db.model('frontArticle',articleSchema);

module.exports = articleModel;
