const versionInsert = require('../models/versionSchema');

/**
 * private API
 * @method insertVersion
 * @param {object} 接收发布版本参数
 * @return {object|null}  insert version number and version content
*/

let insertVersion = async (ctx,next)=>{
	try{
		let req = ctx.request.body;
		let {version,content} = req;
		let res = await versionInsert.create({
			version:version,
			time:FormatDate(new Date()),
			content:content
		})
		ctx.body = {
			error:0,
			success:1
		}
	}catch(e){
		//handle error
		ctx.body = e;
	}
}

/**
 * private API
 * @method getVersion
 * @return {object|null}  Version list sort=>Descending order
*/

let getVersion = async(ctx,next)=>{
	try{
		let res = await versionInsert.find({},{__v:0}).sort({_id:-1});
		ctx.body = {
			error:0,
			list:res
		}
	}catch(e){
		ctx.body = e;
	}
}

/**
 *@method Formatate
 *@param {Date|null} 传递时间参数
 *@return {String} 例如:2018-5-21
*/

function FormatDate (strTime) {
    var date = new Date(strTime);
	return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

module.exports = {
	insertVersion,
	getVersion
}
