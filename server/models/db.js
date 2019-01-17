const mongoose = require('mongoose');
// 172.26.4.181:27017
const db = mongoose.createConnection('mongodb://127.0.0.1:27017/blog');
const chalk = require('chalk');
const success = chalk.bold.green;
const error = chalk.bold.red;

db.once('open',(callback)=>{
	console.log(success('数据库连接成功'));
});

db.on('error',(callback)=>{
	console.log(error('数据库连接失败'));
});

/**
 * private
 * 封装连接数据库
*/

module.exports = db;
