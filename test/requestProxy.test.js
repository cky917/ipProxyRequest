const ipProxyHttp = require('../src/requestProxy')

describe('ipProxyHttp testObject', () => {
  test('ipProxyHttp.send should send request with a proxy ip', (done) => {
    ipProxyHttp.send({
      url: 'https://www.xiaohongshu.com/discovery/item/5aded59bbc1c785a697def8f',
      headers: {
        'Referer': 'https://www.xiaohongshu.com/explore'
      },
    }).then(({ response }) => {
      const successProxy = ipProxyHttp.getSuccuessProxy()
      const sendProxy = response.request.proxy.href

      expect(sendProxy).toBe(`http://${successProxy['host']}:${successProxy['port']}/`);
      done()
    })
  }, 40000)
})