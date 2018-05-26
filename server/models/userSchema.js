const mongoose = require('mongoose');
const db = require('./db');

let userSchema = new mongoose.Schema({
    username:String,
    password:String
});

let userModel = db.model('user',userSchema);

/**
 * private
 * 封装查询用户Schema
*/

module.exports = userModel;
