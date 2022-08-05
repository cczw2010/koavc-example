/**
 * 上传文件, koa-body本身就有该功能，但是配置文件不可变，所以这里使用koa-body依赖的formidable自行实现上传文件的处理。处理结果与koa-body一样。结果会注入ctx.request.upload 
 * config 全局配置上传文件，可分组，系统会自动根据ctx.param.rule来确定分组配置. 也可在调用时单独传入特定配置
 * 一个上传配置的样式如下：
 *    field:'img',    //设定文件域，不设置的话则不限，遍历获取
 *    exts:['jpg','jpeg','png','bmp'],
 *    formidable:{} // https://github.com/node-formidable/formidable
 * 其中 field 和 exts 用于上传文件过滤，是通过 formidable的 filter实现的，如果formidable中传入了自定义的filter函数，这两个属性将失效
 * */
import deepmerge from "deepmerge"
import formidable from 'formidable'
import {extname} from 'path'
import mkdirp from "mkdirp"

export default (config)=>{
  return async(ctx,next)=>{
    // 确认合并配置文件
    const rules = ctx.Config.server.router.upload.rules
    const rule = ctx.params``.rule

    let ruleConfig =(rule && (rule in rules))?rules[rule]:{}
    // console.log(rules,rule,ruleConfig)
    ruleConfig = deepmerge(ruleConfig,config||{})
    const optionForm = ruleConfig.formidable||{}
    if(optionForm.uploadDir){
      const date = new Date()
      optionForm.uploadDir = optionForm.uploadDir.replace('$y',date.getFullYear())
                                                .replace('$m',date.getMonth()+1)
                                                .replace('$d',date.getDate())
      mkdirp.sync(optionForm.uploadDir)
    }
    // filter
    if(!('filter' in optionForm)){
      optionForm.filter = (_part)=>{
        // field
        if('field' in ruleConfig){
          if(_part.name != ruleConfig.field){
            return false
          }
        }
        // ext
        if(Array.isArray(ruleConfig.exts)){
          const ext = extname(_part.originalFilename).replace('.','')
          if(!ruleConfig.exts.includes(ext)){
            return false
          }
        }
        return true
      }
    }

    // 初始化 formidable
    const form = formidable(optionForm);
    // add prototype path
    // form.on('file', (formname, file) => {
    //   file.filepath = optionForm.uploadDir
    // });
    await new Promise((resolve, reject) => {
      form.parse(ctx.req, (err, fields, files) => {
        if (err) {
          // console.log("error",error)
          reject(err);
          return;
        }
        ctx.request.upload = {
          config:ruleConfig,
          files,
          fields
        }
        resolve();
      });
    });

    await next()
  }
}