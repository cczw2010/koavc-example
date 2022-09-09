// 测试返回token
export default{
  method:"get",
  auth:false,
  fn:async (ctx,next)=>{
    ctx.auth.user ={
      username:"awen"
    }
    const {user,token} = ctx.auth

    ctx.body = {user,token}
  }
}