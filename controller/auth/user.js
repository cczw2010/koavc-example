// 测试返回token
export default{
  method:"get",
  auth:false,
  fn:async (ctx,next)=>{
    console.log(">>>>>>>controller",ctx.state.user,ctx.auth)
    const {user:authUser,authToken} = ctx.state
    const {user,token} = ctx.auth
    ctx.body ={user,token,authUser,authToken}
  }
}