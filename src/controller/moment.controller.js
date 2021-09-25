const fs = require('fs');

const fileService = require('../service/file.service');
const momentService = require('../service/moment.service');
const { PICTURE_PATH } = require('../constants/file-path');
class MomentController {
    async create(ctx, next) {
        // 获取数据
        const userId = ctx.user.id;
        const content = ctx.request.body.content;
        //插入数据库
        const result = await momentService.create(userId, content)
        // 返回数据
        ctx.body = result
    }
    //根据id去查询
    async detail(ctx, next) {
        // 获取数据
        const momentId = ctx.params.momentId
        //查询数据库
        const result = await momentService.getMomentById(momentId)
        // 返回数据
        ctx.body = result
    }
    //返回所有的（分页）
    async list(ctx, next) {
        // 获取数据
        const {offset,size} = ctx.query
        //查询数据库
        const result = await momentService.getMomentList(offset,size)
        // 返回数据
        ctx.body = result
    }
    // 修改某一条
    async update(ctx,next){
        const {momentId}= ctx.params;
        const {content} =ctx.request.body;
        const result = await momentService.update(content,momentId)
        ctx.body=result
    }   
    // 删除内容
    async remove(ctx,next){
        const { momentId } = ctx.params;
        const result = await momentService.remove(momentId);
        ctx.body = result;
    }
    // 加上标签
    async addLabels(ctx,next){
        const {labels} = ctx;
        const {momentId} =ctx.params


        for(let label of labels){
            const isExist  = await momentService.hasLabel(momentId,label.id)
            if(!isExist){
                await momentService.addLabel(momentId,label.id)
            }
        }
        ctx.body = "给动态添加标签成功~";
    }
    // 获取配图
 
    async fileInfo(ctx, next) {
        let { filename } = ctx.params;
        const fileInfo = await fileService.getFileByFilename(filename);
        const { type } = ctx.query;
        const types = ["small", "middle", "large"];
        if (types.some(item => item === type)) {
          filename = filename + '-' + type;
        }
    
        ctx.response.set('content-type', fileInfo.mimetype);
        ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
      }
}

module.exports = new MomentController()