// 测试返回token
export default{
  method:"get",
  auth:false,
  fn:async (ctx,next)=>{
    console.log(ctx.host)
    ctx.body = 'auth index'
  }
}