/**
 * 一些辅助工具集api  
 * signToken
 * verifyToken
 */
import jwt from "jsonwebtoken"
export default (cfgAuth)=>{
  return {
     // 生成 jwt token
    signToken(payload){
      return jwt.sign({d:payload},cfgAuth.jwtSecrect,{
        expiresIn:cfgAuth.expiresIn
      })
    },
    // 解析并返回token的payload
    verifyToken(token){
      let payload=null
      try{
        payload = jwt.verify(token,cfgAuth.jwtSecrect)
        if(payload&&payload.d){
          payload = payload.d
          // console.log("token校验成功",userinfo)
        }
      }catch(e){
        // console.log("token无效或者已过期",token)
      }
      return payload
    },
    /**
     * 根据结构字符串获取某对象的深度属性，不存在返回默认值，不设置的话返回null
     * getDeepProp(obj,'a.a.b',{})
     */
    getDeepProp(obj,propStr,defVal=null){
      const props = propStr.split(".")
      let target = obj
      while(props.length>0 && target){
        const key = props.pop()
        target = target[key]
      }
      return target === undefined?defVal:target
    }
  }
}