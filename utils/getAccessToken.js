
const axios=require('axios')
const appid='wxce1d8a9722aa5f6a'
const secret='a02e029d45efb9dabdc556ddfba970ef'
const fs= require('fs')
const path =require('path')
const fileName=path.resolve(__dirname,'./access_token.json')
const url=`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`
const updateAccessToken = async () => {
   const res= await axios.get(url)
    if(res.data.access_token){
        fs.writeFileSync(fileName,JSON.stringify({
            access_token:res.data.access_token,
            createTime:new Date()
        }))
    }else{
        await updateAccessToken()
    }
}
const getAccessToken=async()=>{
    try{
        const result= fs.readFileSync(fileName,'utf-8')
        const resObj=JSON.parse(result)
        const createTime=new Date(resObj.createTime).getTime()
        const nowTime=new Date().getTime()
        return resObj.access_token
        if((nowTime-createTime)/1000/60/60>=2){
            await updateAccessToken()
        }
      return resObj.access_token
    }catch(error){
       await updateAccessToken()
       await getAccessToken()
    }

}

setInterval(async()=>{
  await  updateAccessToken()
},(7200-300)*1000)

module.exports=getAccessToken()