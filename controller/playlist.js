const Router = require('koa-router')
const router = new Router()
const callCloudFn = require('../utils/callCloudFn')
const callCloudDB=require('../utils/callCloudDB')
router.get('/list', async (ctx, next) => {
    const query = ctx.request.query
    const res = await callCloudFn(ctx, 'music', {
        $url: 'playlist',
        start: parseInt(query.start),
        count: parseInt(query.count)
    })
    let data = []
    if (res.data.resp_data) {
        data = JSON.parse(res.data.resp_data).data
    }
    ctx.body = {
        data,
        code: 20000
    }
})

router.get('/getById', async (ctx, next) => { 
    const query = `db.collection('playlist').doc('${ctx.request.query.id}').get()`
    const res=await callCloudDB(ctx,'databasequery',query)
    ctx.body = {
        code: 20000,
        data:JSON.parse(res.data.data)
    }
})

router.post('/updatePlaylist',async(ctx,next)=>{
    const params=ctx.request.body
    const query=`
        db.collection('playlist').doc('${params._id}').update({
            data:{
                name:'${params.name}',
                copywriter:'${params.copywriter}'
            }
        })
    `
    const res = await callCloudDB(ctx, 'databaseupdate', query)
    ctx.body = {
        code: 20000,
        data: res.data
    }
})

module.exports = router