/**
 * 基于level实现的缓存 
 * */
 import {Level} from "level"
 import {join} from "path"
 
 // key value数据库
class Cache{
   constructor(cfgFile,dbname){
     const dbpath = join(process.env.PWD,cfgFile,dbname)
     this.db = new Level(dbpath, { valueEncoding: 'json' })
   }
   async get(key){
     return await this.db.get(key).catch(e=>null)
   }
   async set(k,v){
     return await this.db.put(k, v).then(()=> true).catch(e=> false)
   }
   /**
    * 遍历
    * @params function cb 回调函数
    * @params function options 参数   其他参数查看  https://github.com/Level/level
    *                  {
    *                    limit:1000      Infinity或者-1标识不限制 
    *                  }
    */
   async iterator(cb,options){
     const params = {limit: 1000}
     Object.assign(params,options)
 
     if(typeof cb == 'function'){
       for await (const key of this.db.keys(params)) {
         cb.call(this,key)
       }
       // const keys = await this.db.keys({ gt: 'a', limit: 10 }).all()
     }
   }
   async del(k){
     return await this.db.del(k).then(()=>true).catch(e=>false)
   }
   // 根据条件清空数据，默认全部清空 https://github.com/Level/level#dbclearoptions-callback
   async clear(options){
     return await this.db.clear(options||{}).then(()=>true).catch((e)=>false)
   }
   async close(){
     return await this.db.close().then(()=>true).catch(e=>false)
   }
   // getMany
}

export default async (cfg)=>{
  const caches = {}
  if(cfg.dbs){
    for (const k in cfg.dbs) {
      const dbname = cfg.dbs[k];
      caches[k] = new CacheClass(cfg[mtype],dbname)
    }
  }
  return caches
}
