export default{
  method:"get",
  fn:async (ctx,next)=>{
    await ctx.view("admin/index.vue",{title:"controller home"})
  }
}