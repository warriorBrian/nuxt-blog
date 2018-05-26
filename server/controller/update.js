const frontArticle = require('../models/frontArticleSchema');
const backArticle = require('../models/backArticleSchema');

/**
 *private API
 *@method {update}
 *@param {String} id Adopt ID return Article Detail content
 *@return {Array|null} 返回按ID查找对应数据库文章
*/

let update = async (ctx,next)=>{
    let {id} = ctx.request.query;
    try{
        // let res = frontArticle.findByIdAndUpdate({_id:id},{$})
        let front = await frontArticle.find({_id:id});
        let back = await backArticle.find({_id:id});
        let arr = [...front,...back];
        ctx.body = arr;
    }catch(e){
        //handle error
        ctx.body = e;
    }
}

/**
 *private API
 *@method updateContent
 *@param {object} 接收修改接口传递对象值
 *@return {Array} return Front + Back Article List
*/

let updateContent = async (ctx,next)=>{
    try{
        let req = ctx.request.body;
    	let {title,content,date,des,original,list,id} = req;
        let front = await frontArticle.findByIdAndUpdate({_id:id},{$set:{title,content,time:date,des,original,list}});
        let back = await backArticle.findByIdAndUpdate({_id:id},{$set:{title,content,time:date,des,original,list}});
        let arr = [...front,...back];
        ctx.body = arr;
    }catch(e){
        ctx.body = e;
    }
}

module.exports = {
    update,
    updateContent
}
