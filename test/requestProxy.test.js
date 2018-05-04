const ipProxyHttp = require('../src/requestProxy')

describe('ipProxyHttp testObject', () => {
  test('ipProxyHttp.send should send request with a proxy ip', (done) => {
    ipProxyHttp.send({
      url: 'https://www.baidu.com'
    }).then(({ response }) => {
      const successProxy = ipProxyHttp.getSuccuessProxy()
      const sendProxy = response.request.proxy.href

      expect(sendProxy).toBe(`http://${successProxy['host']}:${successProxy['port']}/`);
      done()
    })
  }, 1000000)
})
