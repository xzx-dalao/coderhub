const jwt = require('jsonwebtoken')

const errorTypes = require('../constants/error-types');
const userService = require('../service/user.service')
const authService = require('../service/auth.service');
const md5password = require('../untils/password-handle');
const { PUBLIC_KEY } = require('../app/config');
const verifyLogin = async(ctx,next)=>{
    console.log('验证登录的middleware~');
    //获取用户名和密码
    const { name, password } = ctx.request.body;
    //判断是否为空
    if (!name || !password) {
        const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
        return ctx.app.emit('error', error, ctx);
      }
    //判断用户是否存在
    const result = await userService.getUserByName(name);
    const user = result[0];
    if (!user) {
      const error = new Error(errorTypes.USER_DOES_NOT_EXISTS);
      return ctx.app.emit('error', error, ctx);
    }
    //判断密码是否一致
    if(md5password(password)!==user.password){
      const error = new Error(errorTypes.PASSWORD_IS_INCORRENT);
      return ctx.app.emit('error', error, ctx);
    } 
    ctx.user = user;
    await next()
}
const verifyAuth = async(ctx,next)=>{
  console.log('验证授权的middleware~');
  // 获取token 
  const authorization = ctx.headers.authorization
  const token =authorization.replace("Bearer ",'')
  
  if(!authorization){
    const error = new Error(errorTypes.UNAUTHORIZATION);
    return ctx.app.emit('error',error,ctx)
  }
  // 验证token
  try {
    const result =jwt.verify(token,PUBLIC_KEY,{
      algorithms:['RS256']
    });
  ctx.user =result
  await next()  
  } catch (err) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    ctx.app.emit('error',error,ctx)
  }
}

// const verifyPermission =(tablename)=>{
//     return async(ctx,next)=>{
//           console.log('验证权限的middleware~');
//           //获取参数
//           const {momentId} = ctx.params;
//           const {id} = ctx.user;
//           // 查询是否具备权限
//           console.log(momentId,id);
//           try {
//             const isPermission = await authService.checkResource(momentId, id);
//             if (!isPermission) throw new Error();
//             console.log('yes');
//             await next();
        
//           } catch (err) {
//             const error = new Error(errorTypes.UNPERMISSION);
//             return ctx.app.emit('error', error, ctx);
//           }
// }
// }
const verifyPermission = async(ctx,next)=>{
    //获取参数
    const [resourceKey]=Object.keys(ctx.params)
    const tableName = resourceKey.replace('Id','')
    const resourceId = ctx.params[resourceKey]
    const {id} = ctx.user
    // 查询是否具备权限
    try {
      const isPermission = await authService.checkResource(tableName,resourceId, id);
      const isaccess =isPermission?'权限通过':'权限不通过'
      console.log('正在验证权限的middleware======>'+isaccess);
      if (!isPermission) throw new Error();
     
      await next();
  
    } catch (err) {
      const error = new Error(errorTypes.UNPERMISSION);
      return ctx.app.emit('error', error, ctx);
    }
  }
module.exports ={verifyLogin,verifyAuth,verifyPermission}