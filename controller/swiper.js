const Router = require('koa-router')
const router = new Router()
const callCloudDB = require('../utils/callCloudDB')
const cloudStorage = require('../utils/callCloudStorage')
router.get('/list', async (ctx, next) => {
    const query = `db.collection('swiper').get()`
    const res = await callCloudDB(ctx, 'databasequery', query)
    let fileList = []
    const data = res.data.data
    for (let i = 0, len = data.length; i < len; i++) {
        fileList.push({
            fileid: JSON.parse(data[i]).fileId,
            max_age: 7200
        })
    }
    const dlRes = await cloudStorage.downStorage(ctx, fileList)
    const dlData = dlRes.data.file_list

    let reDate = []
    for (let i = 0, len = dlData.length; i < len; i++) {
        reDate.push({
            _id: JSON.parse(data[i])._id,
            download_url: dlData[i].download_url,
            fileid: dlData[i].fileid,
        })
    }
    ctx.body = {
        code: 20000,
        data: reDate
    }
})

router.post('/upload', async (ctx, next) => {
    const fileId = await cloudStorage.upload(ctx)
    console.log(fileId)
    const query = `
    db.collection('swiper').add({
        data: {
            fileId: '${fileId}'
        }
})`
    const res = await callCloudDB(ctx, 'databaseadd', query)
    ctx.body = {
        code: 20000,
        id_list: res.data.id_list
    }
})
router.get('/del', async (ctx, next) => {
    const params = ctx.request.query
    const query = `db.collection('swiper').doc('${params._id}').remove()`
    const delDbRes = await callCloudDB(ctx, 'databasedelete', query)
    const delStroageRes = await cloudStorage.batchDeleFile(ctx, [params.fileid])
    // console.log(delDbRes.data)
    // console.log(delStroageRes.data)
    ctx.body = {
        code: 20000,
        data: {
            delDbRes:delDbRes.data,
            delStroageRes:delStroageRes.data
        }
    }

})

module.exports = router