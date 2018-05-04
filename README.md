# ipProxyRequest

一个可以通过免费动态Ip代理发出请求的模块，适合爬虫使用。

获取ip的思路是参考的[这个仓库](https://github.com/kongtianyi/freeProxySpider)，在此基础上进行了代码优化和拓展，封装了request逻辑，可以直接使用。

使用方法，具体可以参考/example/index.js：

```javascript
// async
const { response, data } = await ipProxyRequest.send({ url: 'xxxx'})

// promise
ipProxyRequest.send({ url: 'xxxx'})
.then(({ response, data }) => {
 // xxx
}).catch(err => {
 // xxx
})
```

模块是去爬取[http://www.xicidaili.com/nn](http://www.xicidaili.com/nn)这个页面获取免费代理ip，所以强依赖这个网站。

由于代理ip的不稳定性较大，有些ip的有效期也短。进行多次请求的时候，每次会先去拉取ip列表，逐个进行尝试，能够正常返回请求的Ip就是`succuessProxy`，会继续用于下一次请求，直至这个ip无法正确访问，则用ip列表的下一个进行再尝试。如果ip列表都尝试完了，就会再去爬取ip列表，循环这个操作。

用代理ip访问返回的结果不一定是正确的结果，如果返回的还是错误的页面，比如一些给被封Ip的乱码页，则需要自己进行判断后，调`ipProxyRequest.refreshSuccuessProxy()` 将succuessProxy置为空，这样下次请求就会用新的ip。

`ipProxyRequest.send`方法，传参是`request`模块的标准入参格式。
该方法返回一个`promise`对象。对于每次调用请求，如果一次尝试ip没有正确返回，则会换一个ip进行再请求，直至有正确返回，才会`resolve({ response, data })`。这整个重复尝试的时间如果超过40s，则会`reject(new Error('timeout'))`, 以防止错误的`url`导致的一直错误请求。

主要用于爬虫，所以如果不传`'User-Agent'`, 会默认给随机一个`'User-Agent'`。用由于获取ip过程以及ip自身的代理速度原因，请求会比较慢，我给的超时也给得比较高，不适合对响应速度要求高的场景。

由于request的依赖的模块`tunnel-agent`在遇到某些请求错误时，会通过assert模块抛出一个不可被catch的错误，导致程序意外退出 看了该仓库的issue，发现很多人也遇到了这个问题，而且该模块好像没有人维护了...所以我fork了一份request到我的仓库，把`tunnel-agent`模块的下载地址指向了另外一个开发者解决了这个问题的`tunnel-agent`仓库。