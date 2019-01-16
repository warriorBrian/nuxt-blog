const article = require('../models/frontArticleSchema');
const db = require('../models/commentSchema');

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
        let {_id: id, title} = await article.findOne({"_id": request.id})
        let json = Object.assign(request.comment, {ip: getUserIp(ctx.req)})
        console.log(json)
        let result = await db.updateOne({id: id, title: title}, {$push: {comment: json }}, {upsert:true})
        ctx.body = {result}
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
        if (!result) {
            await db.updateOne({id: request.id}, {$push: {comment: [] }}, {upsert:true})
        }
        ctx.body = {
            error: 0,
            result,
            count: result.comment.length
        }
    } catch (error) {
        ctx.body = error
    }
}

const commentsList = async (ctx) => {
    try {
        let result = await db.find({}, {__v: 0, _id: 0})
        console.log(result)
        ctx.body = {
            error: 0,
            result,
            count: result.comment.length
        }
    } catch (error) {
        ctx.body = error
    }
}

module.exports = {
    insertComment,
    articleComments,
    commentsList
}
