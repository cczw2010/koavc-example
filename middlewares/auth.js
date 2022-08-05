/**
 * auth 中间件，提供登录，和校验登录功能。 校验基于header或cookie或post data中的token， 对应字段为 设置中的tokenkey
 * 全局注入token对象到context中
 * */

export default ()=>{
  return async(ctx,next)=>{
    // -----------------in
    //注入auth对象
    ctx.auth = {
      isLogin:false,
      token:null,
      // 设置用户登录，根据用户信息生成token，并设置cookie登录
      setLogin(user){
        if(!user){return null}
        ctx.caches.user.set(user.id,user)
        const cfg = ctx.Config.auth
        const token = ctx.utils.signToken({id:user.id})
        ctx.auth.token = token
        ctx.auth.payload = user
        ctx.auth.isLogin = true
        ctx.cookies.set(cfg.tokenKey,token,{
          // httpOnly:true
          path:'/',
          maxAge:cfg.expiresIn
        })
        return token
      }
    }
    await checkReqToken(ctx)

    await next()
    // ==================back
    // console.log("back",this.token)
  }
}


// 获取请求中的token 并校验  :header->cookie->formdata
async function checkReqToken(ctx){
  const tokenKey = ctx.Config.auth.tokenKey

  let reqToken = ctx.get(tokenKey)
  if(!reqToken){
    reqToken = ctx.cookies.get(tokenKey)
  }

  if(!reqToken&&ctx.request.body){
    reqToken = ctx.request.body[tokenKey]
  }
  // 校验客户端登录
  if(reqToken){
    const payload = ctx.utils.verifyToken(reqToken)
    if(payload && payload.id){
      const user = await ctx.caches.user.get(payload.id)
      if(user){
        ctx.auth.token = reqToken
        ctx.auth.payload = user
        ctx.auth.isLogin =true
        return true
      }
    }
  }
  return false
}