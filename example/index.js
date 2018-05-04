const ipProxyHttp = require('../index')
const cheerio = require('cheerio')
const { urlList } = require('./config')

async function test() {
  for (let i = 0; i < urlList.length; i++) {
    try {
      let { data } = await ipProxyHttp.send({
        url: urlList[i],
        headers: {
          'Referer': 'https://www.xiaohongshu.com/explore'
        },
      })
      const $ = cheerio.load(data, {
        decodeEntities: false
      })
      let title = $('.note-top .title').text()
      if (!title) {
        ipProxyHttp.refreshSuccuessProxy()
      }
      console.log(title)
    } catch (error) {
      console.error(error)
    }
  }
  console.log('爬取完毕')
}

test()