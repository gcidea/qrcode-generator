# byted-qrcode-generator
A tool for generating qrcode. Support to render canvas, display image, download image file and execute callback, upload image file and execute callback, add customized picture to the center of the qrcode and etc.

Based on https://www.npmjs.com/package/qrcode

# API

完整支持[https://www.npmjs.com/package/qrcode](https://www.npmjs.com/package/qrcode) 的API

基于上述，添加以下API

* render(id, text, option)

>渲染生成二维码及对应Blob对象

>@param id Canvas画布id

>@param text 二维码展示内容

>@param option 二维码渲染配置对象（参见https://www.npmjs.com/package/qrcode）

>@return new Promise 支持回调函数

* upload(id, url)

>上传二维码图片

>@param id Canvas画布id

>@param url 二维码上传地址（非跨域）

>@return new Promise 支持回调函数

* exportImage(id, filename)

>导出二维码图片

>@param id Canvas画布id

>@param filename 二维码文件名

>@return new Promise 支持回调函数

* getBlobInstance(id)

>获取二维码Blob对象实例

>@param id Canvas画布id

>@return blobInstance or {}


* getCanvasInstance(id)

>获取二维码Canvas对象实例

>@param id Canvas画布id

>@return canvasInstance or {}





