/**
 * 缓存，目前支持 file 和redis ,只实例化一个,redis优先级高， 通过`ctx.caches`访问
  option:{
    redis:false,    //redis连接地址:redis[s]://[[username][:password]@][host][:port]/1     ,会根据后面的dbs索引自动生成
    file:'./.cache',   //文件缓存存储目录，基于level实现，不设置的话使用内存
  },
 */
export default async function(option){
  option = Object.assign({file:'./.cache'},option)
  // 动态加载对应的 缓存实现
  const mtype = option.redis?'redis':'file'
  const CacheClass = await import(`./${mtype}.js`).then(m=>m.default)
  const cache = new CacheClass(option[mtype])
  return (ctx,next)=>{
    ctx.cache = cache
    return next()
  }
}
