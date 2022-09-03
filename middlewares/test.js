// initlize function
export default function(){
  return (ctx,next)=>{
    if(ctx.getControllerExtParam("auth")===false){   //false
      return next()
    }else{
      ctx.body="not login"
    }
  }
}