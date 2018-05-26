const frontArticle = require('../models/frontArticleSchema');
const backArticle = require('../models/backArticleSchema');

/**
 *public API
 *@method {list | function} article list
 *@return {object} return article List API
*/

let list = async(ctx,next)=>{
    try{
        let req = ctx.request.query;
    	let { parseInt } = Number;
    	let page = parseInt((req.page-1) * req.pagesize);
    	let pagesize = parseInt(req.pagesize);

        let front = await frontArticle.find({},{__v:0,content:0,original:0}).skip(page).limit(pagesize).sort({'_id':-1});
        let back = await backArticle.find({},{__v:0,content:0,original:0}).skip(page).limit(pagesize).sort({'_id':-1});
        let frontCount = await frontArticle.count({});
        let backCount = await backArticle.count({});
        let [frontArticleList,backArticleList] = [front,back];
        ctx.body = {
            error: 0,
            count: frontCount + backCount,
            front: frontArticleList,
            back: backArticleList
        }
    }catch(e){
        //handle error
        ctx.body = {error:1,info:e}
    }
}

module.exports = {
    list
}
