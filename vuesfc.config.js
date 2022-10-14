export default {
  injectPath:'/vstatic',
  source_page:"src/pages",
  // layout源码目录
  source_layout: "src/layouts",
  // 自定义component源码目录
  source_component: "src/components",
  buildModules:{
    '~/vuebuildmodules/elementui.js':{
      option:{}
    }
  },
  rollupExternal:['element-ui','element-ui/lib/index.js'],
  rollupGlobals:{"element-ui/lib/index.js":"ELEMENT"}
}