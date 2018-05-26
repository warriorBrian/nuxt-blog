const os = require('os');

/**
 *@param {Number|String} freemem 系统空闲内存
 *@param {Array} cpus CPU核心数详细信息
 *@param {String} hostname 主机名
 *@param {String} platform Node.js编译时的操作系统平台
 *@param {String} release 系统发行版本
 *@param {Number|String} totalmem 系统内存总数
 *@param {String} type 操作系统类型
 *@param {String} percetage 内存占用率百分比
 *@param {String} constants 已经发生进程异常
*/
let controller = async(ctx,next)=>{
	let {parseInt} = Number;
	let { freemem, cpus, hostname, platform, release, totalmem, type, constants } = os;
	let total = parseInt(totalmem() /1024 /1024);
	let num = parseInt(freemem() /1024 /1024);
	let percentage = parseInt((num / total) * 100);
	ctx.body = {
			hostname:hostname(),
			platform:platform(),
			release:release(),
			percentage,
			type:type(),
			totalmem:`${total}MB`,
			freemem:`${num}MB`,
			constants:constants.SIGTRAP ? '1' : '0',
			cpu:cpus()
	}
}

module.exports = {
	controller
}
