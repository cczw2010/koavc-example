export default{
  method:"get",
  fn:async (ctx,next)=>{
    
    ctx.body = ctx.params
  }
}