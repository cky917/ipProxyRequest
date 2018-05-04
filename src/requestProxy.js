const rp = require('./requestPromise')
const getProxy = require('./freeIp')
const userAgents = require('./userAgents')
const { sleep, mergeOptions } = require('./utils')

const timeout = 400000
let proxyList = []
let succuessProxy = null
let start = null

const ipProxyHttp = {
  getSuccuessProxy () {
    return succuessProxy
  },
  refreshProxy () {
    succuessProxy = null
    proxyList = []
  },
  refreshSuccuessProxy () {
    succuessProxy = null
  },
  async send(options, repeat) {
    if (!repeat) {
      start = +new Date()
    }
    const ipProxy = await this.getProxyIp()
    const userAgent = userAgents[parseInt(Math.random() * userAgents.length)]
    const defaultOptions = {
      method: 'GET',
      proxy: 'http://' + ipProxy['host'] + ':' + ipProxy['port'],
      headers: {
        'User-Agent': userAgent
      },
      timeout: 20000
    }
    const mergedOpts = mergeOptions(defaultOptions, options)
    
    return new Promise((resolve, reject) => {
      rp(mergedOpts)
      .then(res => {
        succuessProxy = ipProxy
        resolve(res)
      }).catch(async (err) => {
        const duration = +new Date() - start
        succuessProxy = null
        if (duration > timeout) {
          reject(new Error('timeout'))
        } else {
          console.log(`http://${ipProxy['host']}:${ipProxy['port']}代理请求失败，休息1s后换ip重试...`)
          await sleep(1000)
          resolve(this.send(options, true))
        }
      })
    })
  },
  async getProxyIp () {
    if (succuessProxy) {
      return Promise.resolve(succuessProxy)
    }
    if (proxyList.length === 0) {
      proxyList = await getProxy()
    }
    const data = proxyList.pop() || {}
    return Promise.resolve({
      host: data.ip,
      port: data.port
    })
  }
}

module.exports = ipProxyHttp