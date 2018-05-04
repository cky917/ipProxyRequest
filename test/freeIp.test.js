const getProxy = require('../src/freeIp')

describe('freeIp testObject', () => {
  test('getProxy should return an array which not empty', (done) => {
    getProxy().then(res => {
      expect(res.length).toBeGreaterThan(0)
      done()
    })
  }, 100000)
})
