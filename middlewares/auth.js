import jwt from "jsonwebtoken"
import koaJwt from "koa-jwt"

const defOption = {
                  secret:'awenyyds',
                  key:'token',
                  auth:true,
                  refresh:false, //是否自动刷新token
                  cookie:true,
                  post:false,
                  expiresIn:60*60*24,
                  message:'Authentication Error',
                  redirect: false       
                }
// 最终配置
let Option = null

/**
 * jwt auth 校验中间件，依赖koa-jwt, 本中间件内自动引入，外部无需配置（koavc ^1.3.4）
 *  ctx.auth.user      //设置user数据会自动更新token，cookie之外的校验方式需要自行更新token
 *  ctx.auth.token
 * 1 controller 中注入[auth]属性，可以自定义是否需要校验auth
 * 2 如果koa-body没有在本中间件之前引入, post的校验token key将失效，
 * 3 校验顺序： post data -> cookie -> header
 * @export
 * @param {*} option  
 *              {
 *                 key:'authtoken',             //校验的post中或者cookie中的token对应的key
 *                 secret:Date.now(),           //加密信息
 *                 expiresIn:60*60*24,          //过期时间,秒
 *                 refresh:true,                //是否自动刷新token
 *                 cookie:true,                 //是否使用cookie校验，自动注入，自动刷新，自动校验
 *                 post:false,                  //设置的话将自动校验post中对应的键值为token，true的话表示键值和[key]相同
 *                 auth:true                    //默认需要校验
 *                 message:'Authentication Error',  //错误提示语
 *                 redirect: false              //错误跳转地址
 *              }
 */
export default function(option){
  Option = Object.assign({},defOption,option)
  const userKey = 'user'   //储存用户信息的键值，在ctx.state[userKey]
  const tokenKey = Option.key  //储存token的键值，在ctx.state[tokenKey]
  // 1  middleware - koa-jwt
  let getToken = null
  if(Option.post){
    const key = Option.post===true?Option.key:Option.post
    getToken = function(ctx,opts){
      return ctx.request.body?ctx.request.body[key]:null
    }
  }
  const middlewareJwt = koaJwt({
    getToken,
    tokenKey,
    cookie:Option.cookie?tokenKey:false,
    secret:Option.secret,
    key:userKey,
    passthrough: true,
    debug:true
  })
  // 2 middleware - auth
  const middlewareDefault = (ctx,next)=>{
    const needAuth = ctx.getRouteExtParam("auth")??Option.auth
    if(needAuth &&  ctx.state.jwtOriginalError){
      if(Option.redirect){
        ctx.redirect(Option.redirect)
      }else{
        ctx.status = 401
        ctx.body = Option.message
      }
    }else{
      let token = ctx.state[tokenKey]
      let userData = getUserInToken(ctx,userKey)
      // 校验通过，更新token
      if(userData && Option.refresh){
        token = setToken(ctx,userData,Option)
      }
      // 注入auth对象
      ctx.auth = {
        key:tokenKey,
        // 当前token
        token,
        get user(){
          return userData
        },
        // 设置user同时会自动更新token
        set user(data){
          userData = data
          this.token = setToken(ctx,data,Option)
        },
        signToken
      }
      return next()
    }
  }
  return [middlewareJwt,middlewareDefault]
}

// 根据数据生成token,对外提供
function signToken(data){
  return data?jwt.sign({data}, Option.secret, { expiresIn:Option.expiresIn }):''
}
/**
 * 生成token， 如果开启了cookie 会自动设置, 删除只需传入data 为空即可
 *
 * @param {*} ctx
 * @param {*} data
 * @returns string
 */
 function setToken(ctx,data){
  const token = signToken(data)
  const maxAge = data?Option.expiresIn*1000:0
  if(Option.cookie){
    ctx.cookies.set(Option.key,token,{
      httpOnly:true,
      path:'/',
      signed:false,
      maxAge,   //ms
      // 一个 Date 对象, 表示 cookie 的到期日期 (默认情况下在会话结束时过期).如果设置了maxAge，expires将失效
      // expires: 
      overwrite: true 
    })
  }
  return token
}

// 获取用户数据
function getUserInToken(ctx,userKey){
  const data = ctx.state[userKey]
  return data?.data
}