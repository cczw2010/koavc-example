export default{
  method:"get",
  auth:false,
  fn:async (ctx,next)=>{
    ctx.auth.user = null
    const {user,token} = ctx.auth
    ctx.body = {user,token}
  }
}