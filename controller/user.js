// 测试返回token
export default{
  method:"get",
  auth:true,
  fn:async (ctx,next)=>{
    console.log(Object.keys(ctx))
    console.log(">>>>>>>controller",ctx.state,ctx.auth)
    console.log(">>>>>>>controller",ctx.captures)
    ctx.body = ctx.auth.user
  }
}