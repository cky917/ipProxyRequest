const request = require('request')

function rp(options) {
  return new Promise((resolve, reject) => {
    request(options, function(err, response, data) {
      if (err) {
        reject(err)
      } else {
        resolve({ response, data })
      }
    })
  })
}

module.exports = rp
