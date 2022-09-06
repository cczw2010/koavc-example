import jwt from "jsonwebtoken"
import koaJwt from "koa-jwt"

const defOption = {
                  secret:Date.now(),
                  key:'authtoken',
                  auth:true,
                  cookie:true,
                  expiresIn:60*60*24,
                  message:'Authentication Error',
                  redirect: false       
                }


function setToken(ctx,data,option){
  const token = data?jwt.sign({d:data}, option.secret, { expiresIn:option.expiresIn }):''
  if(option.cookie){
    ctx.cookies.set(option.key,token,{
      httpOnly:true,
      path:'/',
      maxAge:option.expiresIn*1000,   //ms
      // 一个 Date 对象, 表示 cookie 的到期日期 (默认情况下在会话结束时过期).如果设置了maxAge，expires将失效
      // expires: 
      overwrite: true 
    })
  }
  return token
}

/**
 * jwt auth 校验中间件，controller 中注入[auth]属性，可以自定义是否需要校验auth
 * 校验顺序： post data -> cookie -> header
 * 如果koa-body没有在本中间件之前引入, post的校验token key将失效，
 * @export
 * @param {*} option  
 *              {
 *                 key:'authtoken',             //校验的post中或者cookie中的token对应的key
 *                 secret:Date.now(),           //加密信息
 *                 expiresIn:60*60*24,          //过期时间,秒
 *                 cookie:true,                 //是否使用cookie校验，自动注入，自动刷新，自动校验
 *                 auth:true                    //默认需要校验
 *                 message:'Authentication Error',  //错误提示语
 *                 redirect: false              //错误跳转地址
 *              }
 */
export default function(option){
  const stateKey = 'user'   //储存用户信息的键值，在ctx.state[stateKey]
  option = Object.assign({},defOption,option)
  // 1  middleware - koa-jwt
  const middlewareJwt = koaJwt({
    getToken:(ctx,opts)=>{
      return ctx.request.body?ctx.request.body[opts.key]:null
    },
    cookie:option.cookie?option.key:false,
    secret:option.secret,
    key:stateKey,
    passthrough: true,
    debug:true
  })
  // 2 middleware - auth
  const middlewareDefault = (ctx,next)=>{
    const needAuth = ctx.getControllerExtParam("auth")??option.auth
    if(needAuth &&  ctx.state.jwtOriginalError){
      if(option.redirect){
        ctx.redirect(option.redirect)
      }else{
        ctx.state = 401
        ctx.body = option.message
      }
    }else{
      ctx.auth = {
        // 当前token
        token:null,
        get user(){
          const data = ctx.state[stateKey]
          const user = data?.d
          // refresh
          this.token = setToken(ctx,user,option)
          return user
        },
        set user(data){
          ctx.state[stateKey] = data
          this.token = setToken(ctx,data,option)
        }
      }
      return next()
    }
  }
  return [middlewareJwt,middlewareDefault]
}

/**
 * 登陆成功后增加
 *
 * @param {*} userInfo
 */
function authSign(userInfo){

}