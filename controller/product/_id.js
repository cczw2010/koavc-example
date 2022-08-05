export default{
  method:"get",
  alias:"seo-test1",
  fn:async (ctx,next)=>{
    const {query,params} = ctx
    console.log("request:_id.js",query,params)
    ctx.body = {
      query,params
    }
  }
}