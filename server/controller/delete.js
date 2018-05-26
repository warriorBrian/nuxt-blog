const frontArticle = require('../models/frontArticleSchema');
const backArticle = require('../models/backArticleSchema');

/**
 * private API
 * @method delArticle
 * @param {object} 接收id和list作为删除标志
 * @return {object|null}  return {n:0,ok:0}
*/

let delArticle = async (ctx,next)=> {
	try{
		let req = ctx.request.body;
	    let {id,list} = req;
	    let db = list == 'Front' ? frontArticle : backArticle;
		let res = await db.remove({_id:id});
		let {n,ok} = res;
		ctx.body = {
			del:n,
			ok
		}
	}catch(e){
		ctx.body = {
			error:1,
			info:e
		};
	}
}


module.exports = {
	delArticle
}
