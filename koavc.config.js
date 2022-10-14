import koaBody from "koa-body"


// 默认参数，路径相对于项目根目录
export default {
  port:3000,
  // ===如果配置了https，将以https方式提供服务
  // https:{
  //   key: fs.readFileSync('ssl/xxxxyun.com.key'),
  //   cert: fs.readFileSync('ssl/xxxxyun.com.pem'),
  // },
  // ===日志
  logger:{
    level:4,          // consola的level
    console:true,     // 开启不开启
  },
  app:[{
    dir:"./app",
    prefix:'',
    middlewares:['~/middlewares/auth.js'],
  }],
  alias:{},
  // ===view渲染配置  
  view:{
    src:'src',        //默认模板地址，相对于根目录
    engine:'vue'      //渲染引擎 default | lodash | vue 可自行拓展
  },
  statics:[["/assets",'./assets']],
  middlewares:[koaBody()],
}