const qiniu = require('qiniu');
const formidable = require('formidable')

/**
 * private API
 * @method token
 * @param {object} 获取七牛云上传图片token
 * @return {token|null}  token
 */

let getToken = async (ctx) => {
    let accessKey = ''  // 源码删除:七牛云获取 ak,必须配置
    let secretKey = ''  // 源码删除:七牛云获取 sk, 必须配置
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    let options = {
        scope: 'blog',  // 对应七牛云存储空间名称
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);
    ctx.body = uploadToken
}

/**
 * private API
 * @method upload Images
 * @param {object} 七牛云上传图片
 * @return {object|null}  img hash filename
 */

let articleImgUpload = async (ctx) => {
    let form = formidable.IncomingForm();
    let {respErr, respBody, respInfo, filename} = await new Promise((resolve) => {
        form.parse(ctx.req, function (err, fields, file) {
            let localFile = file.file.path
            let config = new qiniu.conf.Config();
            let formUploader = new qiniu.form_up.FormUploader(config);
            let putExtra = new qiniu.form_up.PutExtra();
            let key= file.file.name;
            formUploader.putFile(fields.token, key, localFile, putExtra, function(respErr, respBody, respInfo) {
                resolve({
                    respErr,
                    respBody,
                    respInfo,
                    filename: key
                })
            });
        })
    })
    ctx.status = respInfo.statusCode
    ctx.body = {
        respErr,
        img: `http://images.brianlee.cn/${respBody.key}`,
        hash: respBody.hash,
        status: respInfo.statusCode,
        filename
    }
}

/**
 * private API
 * @method delete Images
 * @param {object} filename 接受文件名称
 * @return {object|null}  status result
 */

let delArticleImg = async (ctx) => {
    try {
        let bucket = "blog";    // 对应储存空间名称
        let request = ctx.request.body
        let accessKey = ''   // 源码删除:七牛云获取 ak,必须配置
        let secretKey = ''  // 源码删除:七牛云获取 sk,必须配置
        let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        let config = new qiniu.conf.Config();
        let bucketManager = new qiniu.rs.BucketManager(mac, config);
        let {error, respInfo} = await new Promise((resolve) => {
            bucketManager.delete(bucket, request.filename, function(err, respBody, respInfo) {
                resolve({error: err,respBody, respInfo})
            });
        })
        ctx.body = {
            error,
            status: respInfo.statusCode,
            result: respInfo.data
        }
    } catch (error) {
        ctx.body = error
    }
}

module.exports = {
    getToken,
    articleImgUpload,
    delArticleImg
}
