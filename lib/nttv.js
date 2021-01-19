const axios = require('axios')
var moment = require('moment-timezone')
var sign = require('./sign')
const today = moment().tz('Asia/Shanghai').format('YYYYMMDD')

function getRequestUrl(channelId) {
  console.log('today is:', today)
  const start = today + '000000'
  const end = today + '235959'
  let url = 'https://api.nttv.cn/bms/external/externalService?service=getProgramList&params={"userType":6,"token":"","channelId":"' + channelId + '","idx":0,"size":0,"status":1,"startTime":"' + start + '","endTime":"' + end + '","sortOrder":1}&apiVersion=1.7'
  return sign.signUrlWithParams(url)
}

module.exports = {
  async getSignUrl(channelId, callback) {
    const signedUrl = getRequestUrl(channelId);
    let resp = await axios.get(signedUrl);
    const body = resp.data
    console.log('channel', channelId, 'result:', body.message)
    for (const item of body.data.rows) {
      const video = item.videoList[0]
      const playUrl = video.playUrl
      if (playUrl.indexOf('?') > 0) {
        callback(playUrl.substring(playUrl.indexOf(',') + 1))
        return
      }
    }
  }
}
