
const getAccessToken = require('../utils/getAccessToken')
const axios = require('axios')
const callCloudFn = async (ctx, fName, params) => {
    const accessToken = await getAccessToken
    const options = {
        method: 'POST',
        url: `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${accessToken}&env=${ctx.state.env}&name=${fName}`,
        data: {
            ...params
        },
    }
    return await axios(options).then(res => {
        return res
    })
    .catch(function (err) {
            return err
    })
}

module.exports = callCloudFn