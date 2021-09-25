
const Router = require('koa-router');
const momentRouter = new Router({prefix:'/moment'});
const {
    create,
    // reply,
    update,
    remove,
    list,
    detail,
    addLabels,
    fileInfo
  } = require('../controller/moment.controller.js')
const {
    verifyAuth,
    verifyPermission
} = require('../middleware/auth.middleware')
const {
  verifyLabelExists
}= require('../middleware/label.middleware')
momentRouter.post('/',verifyAuth,create)
momentRouter.get('/',list)
momentRouter.get('/:momentId',detail)

// 用户必须登录，用户具备权限
momentRouter.patch('/:momentId', verifyAuth, verifyPermission, update);
momentRouter.delete('/:momentId', verifyAuth, verifyPermission, remove);

//给动态加上标签
momentRouter.post('/:momentId/label',verifyAuth, verifyPermission,verifyLabelExists,addLabels)

//获取配图
momentRouter.get('/images/:filename',fileInfo)

module.exports=momentRouter