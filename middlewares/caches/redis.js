// redis 缓存实现
import { createClient } from 'redis';
export default class Cache{
  constructor(redisUrl){
    this.db = createClient(`${redisUrl}`);
    //  await client.connect();
    client.connect();
  }
  async get(key){
    return await this.db.get(key).catch(e=>null)
  }
  async set(k,v){
    return await this.db.set(k, v).then(()=> true).catch(e=> false)
  }
  /**
   * 遍历
   * @params function cb 回调函数
   * @params function options 参数
   *                  {
   *                    limit:1000
   *                    match:regx ,   eg: user_*
   *                  }
   */
  async iterator(cb,options){
    options = options||{}
    const params = {
      TYPE: 'string', // `SCAN` only
      MATCH: options.match||'*',
      COUNT: options.limit||1000
    }

    if(typeof cb == 'function'){
      for await (const key of this.db.scanIterator(params)) {
        cb.call(this,key)
      }
    }
  }
  async del(k){
    return await this.db.del(k).then(()=>true).catch(e=>false)
  }
  async clear(options){
    console.log("error: unsupported yet!")
  }
  async close(){
    return await client.quit().then(()=>true).catch(e=>false)
  }
}