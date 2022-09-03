// inject and hook controller param
export const param = 'test'

// initlize function
export default function(){
  console.log(">>>>>>>>>>>>>>11111111111111111")
  // 
  return (ctx,next)=>{
    // console.log(">>>>>>>>>>>>>>2222222", ctx.router,ctx.path)
    console.log(">>>>>>>>>>>>>>33333", Object.keys(ctx))
    console.log(">>>>>>>>>>>>>>44444",ctx._matchedRoute)
    console.log(">>>>>>>>>>>>>>66666",ctx.matched)
    console.log(">>>>>>>>>>>>>>55555",ctx.routerPath)
    console.log(">>>>>>>>>>>>>>77777",ctx.routerName)
    return next()
  }
}