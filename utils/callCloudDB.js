
const getAccessToken = require('../utils/getAccessToken')
const axios = require('axios')
const callClouDB = async (ctx, fName, query={}) => {
    const accessToken = await getAccessToken
    const options = {
        method: 'POST',
        url: `https://api.weixin.qq.com/tcb/${fName}?access_token=${accessToken}`,
        data: {
            env:ctx.state.env,
            query
        },
    }
    return await axios(options).then(res => {
        return res
    })
    .catch(function (err) {
            return err
    })
}

module.exports = callClouDB