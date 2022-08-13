import koaBody from "koa-body"

// 默认参数，路径相对于项目根目录
export default {
  port:3000,
  // ===日志
  logger:{
    level:4,          // consola的level
    console:true,     // 开启不开启
  },
  alias:{},
  // ===如果配置了https，将以https方式提供服务
  // https:{
  //   key: fs.readFileSync('ssl/xxxxyun.com.key'),
  //   cert: fs.readFileSync('ssl/xxxxyun.com.pem'),
  // },
  // ===view渲染配置  
  view:{
    src:'pages',      //默认模板地址，相对于根目录
    engine:'vue'      //渲染引擎 default | lodash | vue 可自行拓展
  },
  statics:[["/assets",'./assets']],
  middlewares:[koaBody()],
  // ============================================================= 编译相关
  vuesfcbuilder:{
    // sfc源文件后缀
    source_ext:'vue',
    // page源码目录
    source_page:"src/pages",
    // layout源码目录
    source_layout: "src/layouts",
    // 自定义component源码目录
    source_component: "src/components",
    // 需要参与编译渲染的第三方的module配置
    buildModules:{
      'vuetify':{
        // 自定义meta 引入相关 css 和 js资源
        // meta:{},
        option:{
          theme: { dark: true },
        }
      }
    },
    // vue-meta设置
    vuemeta:{
      keyName:'head',
      tagIDKeyName:'vmid',
    }
  }
}