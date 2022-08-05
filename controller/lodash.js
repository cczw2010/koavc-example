export default{
  method:"get",
  fn:async (ctx,next)=>{
    await ctx.view("lodash.html",{title:"lodash title"})
  }
}