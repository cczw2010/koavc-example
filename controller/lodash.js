export default{
  method:"get",
  fn:async (ctx,next)=>{
    await ctx.view("lodash/home.html",{title:"lodash title"})
  }
}