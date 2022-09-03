export default{
  method:"get",
  auth:false,
  fn:async (ctx,next)=>{
    await ctx.view("home.vue",{title:"controller home"})
  }
}