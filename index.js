var nttv = require('./lib/nttv')
const fs = require('fs')
const file = '/tmp/nttv-m3u8/nttv.m3u8'

function addLineToFile(content) {
  fs.appendFileSync(file, content + '\n');
}

async function insertChannel(channelId, tvgId, tvgName) {
  const url = await nttv.getSignUrl(channelId)
  addLineToFile("#EXTINF:-1 tvg-id=\"" + tvgId + "\" tvg-name=\"" + tvgName + "\" tvg-logo=\"\" group-title=\"南通电视台\"," + tvgName)
  addLineToFile(url)
  return new Promise(resolve => {resolve()})
}

const dir = '/tmp/nttv-m3u8'
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}

fs.writeFileSync(file, '#EXTM3U\n')
console.log('1')

insertChannel("5e5d857d607dcc56016087facd760098", "061f902e", "新闻综合")
insertChannel("5e5d857d607dcc56016087fa8f3e0095", "120d425d", "社教频道")
insertChannel("5e5d857d607dcc56016087fa535a0092", "", "公共频道")



