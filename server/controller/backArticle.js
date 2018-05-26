const backArticle = require('../models/backArticleSchema');
/**
 * private API
 * @return {object|null}  insert Back article
*/

let insertArticle = async (ctx,next) => {
	try{
		let req = ctx.request.body;
		let {title,content,date,des,original,list} = req;
		const front = await backArticle.update({title},{$set:{title,content,time:date,des,original,list}},{upsert:true});
		let {ok} = front;
		ctx.body = {
			error:0,
			success:ok
		}
	}catch(e){
		ctx.body = {
			error:1,
			info:e
		}
	}
}

/**
 *public API
 *@method {getArticle} Get Back Article
 *@param {String|null} page current page
 *@param {String|null} pagesize page number
 *@return {object} return Back article list 按时间排序
*/

let getArticle = async (ctx,next) => {
	try{
		let req = ctx.request.query;
		let { parseInt } = Number;
		let page = parseInt((req.page-1) * req.pagesize);
		let pagesize = parseInt(req.pagesize);
		console.log(page);
		let list =await backArticle.find({},{__v:0,content:0,original:0,list:0}).skip(page).limit(pagesize).sort({time:-1});
		let count =await backArticle.count({});
		ctx.body = {
			error:0,
			count,
			list
		}
	}catch(e){
		ctx.body = {
			error:1,
			info:e
		}
	}
}

/**
 *public API
 *@param {String} id find Article Detail
 *@return {object|null} return Article Detail
*/

let articleInfo = async (ctx,next)=>{
	try{
		let req = ctx.request.query;
		let {id} = req;
		console.log(req);
		let result = await backArticle.find({_id:id});
		ctx.body = {
			error:0,
			info:result
		}
	}catch(e){
		ctx.body = {
			error:1,
			error:e
		}
	}
}

module.exports = {
	insertArticle,
	getArticle,
	articleInfo
}
