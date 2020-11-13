const Router = require('koa-router')
const router = new Router()
const callCloudFn=require('../utils/callCloudFn')
const callCloudDB=require('../utils/callCloudDB')
router.get('/list', async (ctx, next) => {
    const params = ctx.request.query
    const res = await callCloudFn(ctx, 'blog', {
        $url: 'list',
        keyword:'',
        start: parseInt(params.start),
        count: parseInt(params.count)
    }) 
    let data = []
    if (res.data.resp_data) {
        data = JSON.parse(res.data.resp_data)
    }
    ctx.body={
        code:20000,
        data:data
    }
})

router.get('/del',async(ctx,next)=>{
    const query = `db.collection('blog').doc('${ctx.request.query.id}').remove()`
    const res=await callCloudDB(ctx,'databasedelete',query)
    ctx.body={
        code:20000,
        data:res.data
    }
})

module.exports = router