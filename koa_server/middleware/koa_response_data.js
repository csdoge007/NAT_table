//处理业务逻辑的中间件，读取某个json文件的数据
const path = require('path');
const fileUtils = require('../utils/file_utils');
module.exports = async (ctx,next) =>{
    const url = ctx.request.url; // /api/seller
    let filePath = url.replace('/api',''); // /seller
    filePath = '../data' + filePath + '.json' // ../data/seller.json
    // filePath = '../data' + filePath
    filePath = path.join(__dirname,filePath);// _dirname是当前js文件的绝对路径
    try{
        const ret = await fileUtils.getFileJsonData(filePath);
        ctx.response.body = ret;
    } catch(error){
        const errorMsg = {
            message : '读取文件内容失败，文件资源不存在',
            status: 404
        }
        ctx.response.body = JSON.stringify(errorMsg);
    }
    //console.log(url);
    await next();
}