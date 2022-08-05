/**
 * 用于路由的userAuth 中间件，作用为根据登录状态阻断或者重定向请求。 
 * 判断依托于 core/auth.js 核心中间件，该核心中间件的作用是登录和校验相关操作
 * options设置参数，优先级高于config.js中router中的全局设置 
 * options {
 *          redirectTo  设置了有效值之后，如果没有登录,则自动跳转，不设定该值否则返回401
 *        }
 * */
import deepmerge from "deepmerge"
export default (options)=>{
  options =options||{}
  return async(ctx,next)=>{
    const defOptions = ctx.utils.getDeepProp(ctx.Config.server,'router.userAuth',{})
    options = deepmerge(defOptions,options)
    // console.log("userAuth",ctx.auth)
    // -----------------in
    if(!ctx.auth.isLogin){
      if(options.redirectTo){
        ctx.redirect(options.redirectTo)
      }
      ctx.status = 401
      return
    }
    // 校验通过，继续
    ctx.status = 200
    await next()
  }
}

