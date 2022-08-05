export default{
  method:"get",
  fn:async (ctx,next)=>{
    await ctx.view("home.vue",{title:"controller home"})
  }
}