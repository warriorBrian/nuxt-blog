const router = require('koa-router')();
const frontArticle = require('../controller/article');
// const backArticle = require('../controller/backArticle');
const update = require('../controller/update');
const articleList = require('../controller/articleList');
const del = require('../controller/delete');
const version = require('../controller/version');
const LoginStrategy = require('../controller/login');
const {geet, validate} = require('../controller/geet');
const system = require('../controller/system');
const {getToken, articleImgUpload, delArticleImg} = require('../controller/articleImg');
const multer = require('koa-multer');
const {insertComment, articleComments, commentsList, commentConfig, configList, delComment} = require('../controller/comment');
//配置
const storage = multer.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    //修改文件名称
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
//加载配置
const upload = multer({storage: storage})
router.prefix('/api');
/*插入文章接口*/
router.post('/article/insertFront',frontArticle.insertArticle);
// router.post('/article/insertBack',backArticle.insertArticle);
/*查询文章接口*/
router.get('/article/getFrontArticle',frontArticle.getArticle);
// router.get('/article/getBackArticle',backArticle.getArticle);
/*文章详情接口*/
router.get('/article/getFrontArticleInfo',frontArticle.articleInfo);
// router.get('/article/getBackArticleInfo',backArticle.articleInfo);
/*修改文章接口*/
router.get('/article/update',update.update);
router.post('/article/updateContent',update.updateContent);
/*文章列表接口*/
router.get('/article/frontList',articleList.frontList);
router.get('/article/backList',articleList.backList);
/*删除文章接口*/
router.post('/article/delArticle',del.delArticle);
/*发布版本接口*/
router.post('/version/insert',version.insertVersion);
/*获取版本接口*/
router.get('/version/getVersion',version.getVersion);
/*登录接口*/
router.post('/login',LoginStrategy.login);
/*控制面板信息*/
router.post('/system',system.controller);
/*上传接口*/
router.post('/upload',upload.single('file'), frontArticle.uploadFile);
/*删除图片接口*/
router.post('/deleteFile', frontArticle.deleteFile)
/*查询单文章*/
router.post('/findOneArticle', frontArticle.findOneArticle)
/*评论接口*/
router.post('/comment', insertComment)
/*评论列表接口*/
router.post('/articleComments', articleComments)
/*后台评论列表管理*/
router.post('/commentsList', commentsList)
/*后台评论配置接口*/
router.post('/comment/config', commentConfig)
/*后台评论配置列表*/
router.post('/comment/config/list', configList)
/*删除某一条评论接口*/
router.post('/comment/delComment', delComment)
/*获取上传图片token*/
router.post('/article/getToken', getToken)
/*上传七牛云图片*/
router.post('/article/upload', articleImgUpload)
/*删除七牛云图片*/
router.post('/article/delArticleImg', delArticleImg)
/*获取极验校验*/
router.get('/geet', geet)
module.exports = router;
