const Router =require('koa-router')
const router =new Router()
const getAccessToken=require('../utils/getAccessToken')
const env='music-demon-7gyaq5xib9f2e118'
const name='music'
const axios=require('axios')
router.get('/list'  ,async(ctx,next)=>{
  const accessToken=await getAccessToken
  ctx.body=accessToken
    const url=`https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${accessToken}&env=${env}&name=${name}`
    let data={
        $url:'playlist',
        start:0,
        count:50
    }
  ctx.body= await axios.post(url,data).then(res=>{
        return JSON.parse(res.data.resp_data).data
    })
})

module.exports=router