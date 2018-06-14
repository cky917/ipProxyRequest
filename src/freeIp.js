const rp = require('./requestPromise')
const cheerio = require('cheerio')
const { sleep } = require('./utils')

async function getUsefulProxy () {
  let proxyList = []
  let usefulProxyList = []
  let count = 0
  let usefulCount = 0
  while (proxyList.length === 0) {
    if (count > 0) {
      console.log('proxy列表为空，休息1s重新获取')
      await sleep(1000)
    }
    proxyList = await getProxyList()
    count++
  }
  while (usefulProxyList.length === 0) {
    if (usefulCount > 0) {
      console.log('没有可用的proxy，休息1s重新获取')
      await sleep(1000)
    }
    usefulProxyList = await check(proxyList)
    usefulCount++
  }
  return Promise.resolve(usefulProxyList)
}

/**
 * 获取www.xicidaili.com提供的免费代理
 */
function getProxyList () {
  const url = 'https://proxy.l337.tech/txt' // 国内高匿代理
  let proxys = []
  return new Promise((resolve, reject) => {
    rp({
      url: url,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36',
      },
      timeout: 20000
    }).then(res => {
      const { body } = res.response;
      const proxyList = body.split('\n').filter(item => item);
      const proxys = proxyList.map(item => {
        const proxy = item.split(':')
        return {
          ip: proxy[0],
          port: proxy[1]
        }
      })
      console.log(proxys)
      resolve(proxys)
    }).catch(err => {
      console.log(err)
      resolve([])
    })
  })
}

function checkProxy (proxy) {
  // 尝试请求百度的静态资源公共库中的jquery文件
  const url = 'http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js'
  return new Promise((resolve) => {
    rp({
      url: url,
      method: 'GET',
      proxy: 'http://' + proxy['ip'] + ':' + proxy['port'],
      timeout: 20000 // 20s没有返回则视为代理不行
    }).then(({ response }) => {
      if (response.statusCode === 200) {
        resolve(proxy)
        console.log(`${proxy.ip}:${proxy.port}, useful!`)
      } else {
        resolve(null)
      }
    }).catch(() => {
      resolve(null)
    })
  })
}
/**
 * 过滤无效的代理
 */
function check (proxys) {
  return new Promise((resolve, reject) => {
    const requestArr = []
    for (var i = 0; i < proxys.length; i++) {
      var proxy = proxys[i]
      requestArr.push(checkProxy(proxy))
    }
    Promise.all(requestArr).then(data => {
      const useful = data.filter(item => item)
      resolve(useful)
    }).catch(err => {
      console.log(`校验全部失败: ${err}`)
      resolve([])
    })
  })
}

module.exports = getUsefulProxy
