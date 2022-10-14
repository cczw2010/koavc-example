import DB from "./db.js"

export default function(){
  const db = new DB()
  return (ctx,next)=>{
    db.setLogger(ctx.logger)
    ctx.db = db
    return next()
  }
}