const rp = require('../src/requestPromise')
const gettype = Object.prototype.toString

describe('rp testObject', () => {
  test('rp should resolve an object with { response , data }', (done) => {
    rp({ url: 'https://www.baidu.com'})
    .then((res) => {
      expect(res).toHaveProperty('response');
      expect(res).toHaveProperty('data');
      done()
    })
  })
  test('rp should reject with error', (done) => {
    rp({ url: 'https://xxxx'})
    .catch(err => {
      expect(gettype.call(err)).toBe('[object Error]')
      done()
    })  
  })
})
