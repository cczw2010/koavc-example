// Class Model 通用基础处理
// 依赖于 @prisma/client  prisma
// import { PrismaClient } from '@prisma/client'
import pkg from '@prisma/client'
const { PrismaClient } = pkg

export default class Model{
  constructor(logger){
    this.logger = logger||console
    // 实例化
    const prisma = new PrismaClient({
      //自定义设置，不设置的话走 schema.prisma文件
      // datasources: { },
      log: [
        // {level:'query',emit:"event"},
        {level:'info',emit:"event"},
        {level:'warn',emit:"event"},
        {level:'error',emit:"event"},
      ],
      errorFormat: 'pretty',  //pretty|colorless|minimal
    });
    // console.log(prisma._dmmf.modelMap);
    // logger("prisma 初始化成功","prisma")
    /* 软删除中间件,只处理重要表 */
    prisma.$use(softDelete(['user','message']))
    prisma.$on('query', (e)=>{
      // e.timestamp
      const msg = `prisma:query ${e.query}; params=${e.params}; duration=${e.duration}; target=${e.target}`
      this.logger.log(msg,"prisma")
    });
    prisma.$on('warn',  (e)=>{
      const msg = `prisma:warn ${e.message}; target=${e.target}`
      this.logger.warn(msg,"prisma")
    });
    prisma.$on('info',  (e)=>{
      const msg = `prisma:info ${e.message}; target=${e.target}`
      this.logger.info(msg,"prisma");
    });
    prisma.$on('error',  (e)=>{
      const msg = `prisma:error ${e.message}; target=${e.target}`
      this.logger.error(msg,"prisma");
    });
    this.prisma = prisma
  }
  setLogger(logger=null){
    this.logger = logger||console
  }
  // 设定当前操作表,支持链式
  table(schemaName){
    this.schemaName = schemaName
    return this
  }
  /**
   * 
   * @returns array
   */ 
  /**
   * 列表查询
   * @param {object} where
   * @param {object} orderBy      默认  {id:'desc'}
   * @param {number} [page=1]     -1或者0代表不限
   * @param {number} [size=20]
   * @returns  array
   */
  async list(where,orderBy,page=1,size=20){
    where = where ||{}
    orderBy = orderBy || {id:'desc'}
    const options = {
      where,
      orderBy
    }
    if(page>0){
      options.skip =  (page-1)*size
      options.take =  size
    }
    // 判断当前页码有无数据
    return await this.prisma[this.schemaName].findMany(options).catch(e=>{
        this.logger.error(e.message,'prisma')
        return []
      })
  }
  /**
   * 新增
   * @param  {object} data
   * @return {object}    item || null
   **/ 
  async create(data){
    return await this.prisma[this.schemaName].create({data}).then(item=>item).catch(e=>{
      this.logger.error(e.message,'prisma')
      return null
    })
  }
  /**
   * 新增多个  不支持sqlite
   * @param  {array} data  数据对象数组
   * @param  {booelean} skipDuplicates  去重，默认true
   * @return {int}    num 
   **/ 
  async creates(data,skipDuplicates=true){
    return await this.prisma[this.schemaName].createMany({
      data,
      skipDuplicates
    }).then(result=>result.count).catch(e=>{
      this.logger.error(e.message,'prisma')
      return 0
    })
  }
  /**
   * 修改
   * @param {object}  where
   * @param {object}  data
   * @returns item|null 
   */
  async update(where,data){
    if(!data||!where){
      return null;
    }
    return await this.prisma[this.schemaName].updateMany({
      where,
      data
    }).catch(e=>{
      this.logger.error(e.message,'prisma')
      return null
    })
  }
  /**
   * 根据id修改
   * @param {int}     id
   * @param {object}  data
   * @returns item|null 
   */
  async updateById(id,data){
    if(!data||!id){
      return null;
    }
    const where = {id};
    return await this.prisma[this.schemaName].update({
      where,
      data
    }).catch(e=>{
      this.logger.error(e.message,'prisma')
      return null
    })
  }
  /**
   * 删除
   * @param {object}  where 
   * @returns num 
   */
  async del(where){
    if(!where){
      return 0;
    }
    return await this.prisma[this.schemaName].deleteMany({
      where
    }).catch(e=>{
      this.logger.error(e.message,'prisma')
      return 0
    })
  }
  /**
   * 根据id删除
   * @param {int}   id
   * @returns item|null 
   */
  async delById(id){
    if(!id){
      return 0;
    }
    const where = {id};
    return await this.prisma[this.schemaName].delete({
      where
    }).catch(e=>{
      this.logger.error(e.message,'prisma')
      return null
    })
  }
  // 关闭连接
  async close(){
    this.prisma.$disconnect().then(()=>{
      this.logger.info(`prisma 关闭`, 'prisma')
    }).catch(e=>{
      this.logger.error(`prisma 关闭错误:${e.message}`)
    })
  }
}


// prisma 软删除中间件件
function softDelete(models){
  models = models||[]
  return async (params, next) => {
    if (models.includes(params.model)) {
      //========= 删除
      if (params.action == 'delete') {
        // 删除查询
        // 将操作更改为更新
        params.action = 'update'
        params.args['data'] = { deleted: new Date() }
      }
      if (params.action == 'deleteMany') {
        // 删除许多查询
        params.action = 'updateMany'
        if (params.args.data != undefined) {
          params.args.data['deleted'] = new Date()
        } else {
          params.args['data'] = { deleted: new Date() }
        }
      }
      //========== 查询
      if (params.action == 'findUnique') {
        // 更改为 findFirst - 无法过滤除 ID / unique 和 findUnique 之外的任何内容
        params.action = 'findFirst'
        // 添加 'deleted' 过滤器  保持 ID 过滤器
        params.args.where['deleted'] = null
      }
      if (params.action == 'findMany') {
        // 查找许多查询
        if (params.args.where != undefined) {
          if (params.args.where.deleted == undefined) {
            // 如果未明确要求删除记录，则将其排除在外
            params.args.where['deleted'] = null
          }
        } else {
          params.args['where'] = { deleted: null }
        }
      }
    }
    return next(params)
  }
}