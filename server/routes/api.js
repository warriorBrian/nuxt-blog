const router = require('koa-router')();
const frontArticle = require('../controller/article');
const backArticle = require('../controller/backArticle');
const update = require('../controller/update');
const articleList = require('../controller/articleList');
const del = require('../controller/delete');
const version = require('../controller/version');
const LoginStrategy = require('../controller/login');
const system = require('../controller/system');
const multer = require('koa-multer');
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
router.post('/article/insertBack',backArticle.insertArticle);
/*查询文章接口*/
router.get('/article/getFrontArticle',frontArticle.getArticle);
router.get('/article/getBackArticle',backArticle.getArticle);
/*文章详情接口*/
router.get('/article/getFrontArticleInfo',frontArticle.articleInfo);
router.get('/article/getBackArticleInfo',backArticle.articleInfo);
/*修改文章接口*/
router.get('/article/update',update.update);
router.post('/article/updateContent',update.updateContent);
/*文章列表接口*/
router.get('/article/list',articleList.list);
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
router.post('/deleteFile', frontArticle.deleteFile)
/*查询单文章*/
router.post('/findOneArticle', frontArticle.findOneArticle)
module.exports = router;
