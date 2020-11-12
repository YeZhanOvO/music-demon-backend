const getAccessToken = require('../utils/getAccessToken')
const axios = require('axios')
const rp=require('request-promise')
const fs = require('fs')
const cloudStorage = {
    async downStorage(ctx, fileList) {
        const accessToken = await getAccessToken
        const options = {
            method: 'post',
            url: `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${accessToken}`,
            data: {
                env: ctx.state.env,
                file_list: fileList
            },
        }
        return await axios(options).then((res) => {
            return res
        }).catch(err => {
            return err
        })
    },
    async upload(ctx) {
        const accessToken = await getAccessToken
        const file = ctx.request.files.file
        const path = `swiper/${Date.now()}-${Math.random()}-${file.name}`
        const options = {
            method: 'post',
            url: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${accessToken}`,
            data: {
                env: ctx.state.env,
                path: path
            }
        }
        const info = await axios(options).then(res => {
            return res.data
        })
        // 上传图片操作
        const params = {
            url: info.url,
            method: 'post',
            headers: {
                'content-type': 'multipart/form-data'
            },
            formData:{
                key: path,
                Signature: info.authorization,
                'x-cos-security-token': info.token,
                'x-cos-meta-fileid': info.cos_file_id,
                "file": {
                    value:fs.createReadStream(file.path),
                    options: {
                        filename: file.name,
                        contentType: file.type
                    }

                }   
            }
        }
        // 由于axios对multipart支持度不好，所以使用request模块替代
        await rp(params)
        return info.file_id
    },
    async batchDeleFile(ctx,fileidList){
        const accessToken = await getAccessToken
        const options = {
            method: 'post',
            url: `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${accessToken}`,
            data: {
                env: ctx.state.env,
                fileid_list: fileidList
            },
        }
        return await axios(options).then(res=>{
            return res
        }).catch(err=>{
            return err
        })
    }
}
module.exports = cloudStorage