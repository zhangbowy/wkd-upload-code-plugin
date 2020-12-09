# upload-code-plugin

[![npm version](https://img.shields.io/npm/v/axios.svg?style=flat-square)](https://www.npmjs.org/package/axios)
[![build status](https://img.shields.io/travis/axios/axios.svg?style=flat-square)](https://travis-ci.org/axios/axios)
[![code coverage](https://img.shields.io/coveralls/mzabriskie/axios.svg?style=flat-square)](https://coveralls.io/r/mzabriskie/axios)

打包完自动上传代码插件

杭州微客到测试栈自动上传代码的webpack插件




## Installing

Using npm:

```bash
$ npm install upload-code-plugin
```


## Example


```js
// import
const uploadPlugin = require('./uploadCode-plugin');

module.exports = {
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    // new
    new uploadPlugin({...option})
  ]
}

//option
{
    serverUrl = 'http://admin.tecqm.com'; //serve_url
    loginApi = '/login/index'; //login_api
    loginParams = { //login_params
        account: 'admin',
        password: '********'
    };
    uploadApi = '/System/upload'; //upload_api
    uploadParams = { //upload_params
        type: 2
    };
}
```

 by zhangbo http://www.wkdao.com

## License

MIT
