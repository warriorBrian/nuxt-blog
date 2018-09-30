const frontArticle = require('../models/frontArticleSchema');
const fs = require('fs');
/**
 * private API
 * @method insert
 * @param {object} 接收发布文章接口传递对象值
 * @return {object|null}  insert Front article
*/

let insertArticle = async (ctx,next) => {
	try{
		let req = ctx.request.body;
		let {title,content,date,des,original,list} = req;
		const front = await frontArticle.update({title},{$set:{title,content,time:date,des,original,list}},{upsert:true});
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
 *@param {number|null} page
 *@param {number|null} pagesize
 *@return {object} return article list 按时间排序
*/

let getArticle = async (ctx,next) => {
	try{
		let req = ctx.request.query;
		let { parseInt } = Number;
		let page = parseInt((req.page-1) * req.pagesize);
		let pagesize = parseInt(req.pagesize);
		console.log(page);
		let list =await frontArticle.find({},{__v:0,content:0,original:0,list:0}).skip(page).limit(pagesize).sort({_id:-1});
		let count =await frontArticle.count({});
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
		let result = await frontArticle.find({_id:id});
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

const uploadFile = async (ctx) => {
    try {
				let req = ctx.req.body;
        let file = ctx.req.file
        let path = `http://${ctx.headers.host}/uploads/${file.filename}`
        let result = await frontArticle.update({_id: req.id }, {$set: {banner: path, imgFileName:file.filename}},{upsert:true})
        ctx.status = 200
        ctx.body = {
            status: ctx.status,
            filename: file.filename,
            path
        }
    } catch (error) {
        ctx.body = error
    }
}

const findOneArticle = async (ctx) => {
	try {
		let req = ctx.request.body;
    let result = await frontArticle.findOne({_id: req.id})
    ctx.body = {
      error:0,
      info: result
    }
  } catch (error) {
    ctx.body = {
      error: 1,
      info: error
    }
  }
}

const deleteFile = async (ctx) => {
    try {
        let request = ctx.request.body
        let { imgFileName } = await frontArticle.findById({_id: request.id});
        let path = `${process.cwd()}/public/uploads/${imgFileName}`;
        await fs.unlinkSync(path)
        let result = await frontArticle.update({_id: request.id }, {$unset: {banner: -1, imgFileName:-1}})
        ctx.status = 200
        ctx.body = {
            status: ctx.status,
            result
        }
    } catch (error) {
        ctx.body = error
    }
}

module.exports = {
	insertArticle,
	getArticle,
	articleInfo,
  uploadFile,
	deleteFile,
	findOneArticle
}
