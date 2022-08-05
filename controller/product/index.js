export default{
  method:"get",
  alias:"seo-test",
  fn:async (ctx,next)=>{
    const {query,params} = ctx

    // console.log(Object.keys(ctx))
    // console.log(ctx.routerPath)
    // console.log(ctx.router.route(ctx.routerPath))
    console.log("request:index.js",query,params)

    ctx.body = "index"
  }
}