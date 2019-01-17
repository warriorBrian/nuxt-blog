const article = require('../models/frontArticleSchema');
const db = require('../models/commentSchema');
const config = require('../models/commentConfigSchema');
const md5 = require('./md5');
const userModel = require('../models/userSchema');
/**
 * private API
 * @method insert
 * @param {object} id
 * @param {object} comments
 * @return {object|null}  status
 */

const insertComment = async (ctx) => {
    try {
        let request = ctx.request.body;
        if (!request.comment.pass) {
            let {_id: id, title} = await article.findOne({"_id": request.id})
            delete request.comment.pass
            let json = Object.assign(request.comment, {ip: getUserIp(ctx.req)})
            let result = await db.updateOne({id: id, title: title}, {$push: {comment: json }}, {upsert:true})
            ctx.body = {
                status: '0000',
                success: 1,
                result
            }
        } else {
            let pwd = md5(md5(request.comment.pass).substr(3,8)+md5(request.comment.pass))
            let pass = await userModel.find({password: pwd})
            if (pass.length !== 0) {
                let {_id: id, title} = await article.findOne({"_id": request.id})
                delete request.comment.pass
                let json = Object.assign(request.comment, {ip: getUserIp(ctx.req)})
                let result = await db.updateOne({id: id, title: title}, {$push: {comment: json }}, {upsert:true})
                ctx.body = {
                    status: '0001',
                    success: '1',
                    result
                }
            } else {
                ctx.body = {
                    msg: '用户不存在，身份校验不正确',
                    success: '0',
                    status: '0004'
                }
            }
        }
    } catch (error) {
        ctx.body = error
    }
}

/**
 * private API
 * @method insert
 * @param {object} id
 * @return {object|null}  commentsLists
 */
const getUserIp = (req) => {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}
const articleComments = async (ctx) => {
    try {
        let request = ctx.request.body;
        let [result] = await db.find({"id": request.id}, {__v: 0, _id: 0})
        ctx.body = {
            error: 0,
            result,
            count: result.comment.length
        }
    } catch (error) {
        ctx.body = error
    }
}

/**
 * private API
 * @method insert
 * @return {object|null}  comments Lists
 */

const commentsList = async (ctx) => {
    try {
        let req = ctx.request.body;
        let { parseInt } = Number;
        let page = parseInt((req.page-1) * req.pageSize);
        let pageSize = parseInt(req.pageSize);
        let result = await db.find({}, {__v: 0, _id: 0}).skip(page).limit(pageSize).sort({'_id':-1});
        let count = await db.count({})
        ctx.body = {
            error: 0,
            result,
            count
        }
    } catch (error) {
        ctx.body = error
    }
}

/**
 * private API
 * @method insert
 * @param {object} status
 * @param {object} author
 * @return {object|null}  comment config
 */

const commentConfig = async (ctx) => {
    try {
       let request = ctx.request.body
       let result = await config.updateOne({},{$set: {status: request.status}, $addToSet:{author: request.author}}, {upsert:true});
       console.log(result)
       ctx.body = result
    } catch (error) {
      ctx.body = error
    }
}

/**
 * private API
 * @method insert
 * @return {object|null}  config list
 */

const configList = async (ctx) => {
    try {
        let [result] = await config.find({}, {_id: 0, __v: 0})
        ctx.body = {
            error: 0,
            data: result
        }
    } catch (error) {
        ctx.body = {
            error: 1,
            data: error
        }
    }
}

/**
 * private API
 * @method insert
 * @param {object} timestamp
 * @return {object|null}  del comment
 */

const delComment = async (ctx) => {
    try {
        let request = ctx.request.body
        let { parseInt } = Number;
        let result = await db.update({"id": request.id}, {$pull: {comment: {time: parseInt(request.time)}}})
        ctx.body = {
            error: 0,
            delCount: result.nModified,
            success: request.ok
        }
    } catch (error) {
        ctx.body = {
            error: 1,
            data: error
        }
    }
}

module.exports = {
    insertComment,
    articleComments,
    commentsList,
    commentConfig,
    configList,
    delComment
}
