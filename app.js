const Koa =require('koa')
const app=new Koa()
const Router =require('koa-router')
const router =new Router()
const cors = require('koa2-cors')
const koaBody=require('koa-body')
const env = 'music-demon-7gyaq5xib9f2e118'

// 跨域
app.use(cors({
    origin: ['http://localhost:9528'],
    credentials: true
}))
// 接收post参数解析
app.use(koaBody({
    multipart:true
}))
// 设置全局云环境ID
app.use(async (ctx,next)=>{
    ctx.state.env=env
    await next()
})  
const playlist=require('./controller/playlist')
const blog=require('./controller/blog')
const swiper=require('./controller/swiper')
router.use('/playlist',playlist.routes())
router.use('/swiper',swiper.routes())
router.use('/blog',blog.routes())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000,()=>{
    console.log('启动成功')
})
