export default{
  method:"get",
  fn:async (ctx,next)=>{
    const {query,params} = ctx
    console.log("request:_id.js",query,params)
    ctx.alias.set(ctx.path,"/home")
    ctx.body = {
      query,params
    }
  }
}