var qrcode = require("qrcode");
var axios = require("axios");
var Util = require("./util");

if(!Util.browserDetection()) {
    module.exports = null;
} else {
    //维护全局Blob对象实例
    qrcode.blobInstance = {};

    //维护全局Canvas对象实例
    qrcode.canvasInstance = {};
    
    /** 渲染生成二维码及对应Blob对象
     * @param id Canvas画布id
     * @param text 二维码展示内容
     * @param option 二维码渲染配置对象（完整支持https://www.npmjs.com/package/qrcode）
     * @return new Promise
     */
    qrcode.render = (id, text, option) => {
        return new Promise((resolve, reject) => {
            var cus_id = "";
    
            if(id) {
                cus_id = id;
                if(!Util.domValidate(cus_id).status) {
                    return;
                } else {
                    qrcode.canvasInstance[cus_id] = Util.domValidate(cus_id).result;
                }
            } else {
                //调用时未传入id，主动创建canvas元素
                cus_id = (new Date()).getTime() + "";
                qrcode.canvasInstance[cus_id] = document.createElement("canvas");
                qrcode.canvasInstance.setAttribute("id", "byted-qrcode-generator_" + cus_id);
                document.body.appendChild(qrcode.canvasInstance[cus_id]);
            }
        
            qrcode.toDataURL(qrcode.canvasInstance[cus_id], text, option, function (error) {
                if (error) {
                    console.error("[byted-qrcode-generator] " + error);
                    reject(error);
                } else {
                    let imageSrc = qrcode.canvasInstance[cus_id].toDataURL("image/png").replace("image/png", "image/octet-stream");
    
                    qrcode.blobInstance[cus_id] = Util.convertBase64UrlToBlob(imageSrc);
                    
                    console.log("[byted-qrcode-generator] qrcode generate success.");
                    resolve(qrcode);
                }
            })
        })
    }
    
    /** 上传二维码图片
     * @param id Canvas画布id
     * @param url 二维码上传地址（非跨域）
     * @return new Promise
     */
    qrcode.upload = (id, url) => {
        if(!qrcode.blobInstance[id]) {
            console.error(`[byted-qrcode-generator] upload Error. the blobInstance  named '${id}' does not exist, please render QRCode first.`);
        } else {
            return new Promise((resolve, reject) => {
                let formData = new FormData();
                formData.append("file", qrcode.blobInstance[id]);
        
                axios({
                    method: 'post',
                    url: url,
                    data: formData,
                    headers: {'Content-Type': 'multipart/form-data'}
                }).then((res) => {
                        if (res.status == 200) {
                            let result = res.data.status_code;
                            if (result == 0) {
                                console.log("[byted-qrcode-generator] qrcode upload successfully.")
                                resolve(qrcode);
                            } else {
                                console.error("[byted-qrcode-generator] qrcode upload failed.")
                                reject(qrcode);
                            }
                        }
                    }).catch((err) => {
                        console.error("[byted-qrcode-generator] qrcode upload failed. " + err);
                        reject(qrcode);
                    });
            })
        }
    }
    
    /** 导出二维码图片
     * @param id Canvas画布id
     * @param filename 二维码文件名
     * @return new Promise
     */
    qrcode.exportImage = (id, filename) => {
        return new Promise((resolve, reject) => {
            if(!qrcode.canvasInstance[id]) {
                console.error(`[byted-qrcode-generator] exportImage Error. the canvasInstance named '${id}' does not exist, please render QRCode first.`);
                return;
            } else {
                var link = document.createElement("a");
                link.href = qrcode.canvasInstance[id].toDataURL("image/png");
                link.download = (filename || "byted-qrcode-generator") + "_" + (new Date()).getTime();
                link.click();
                resolve(qrcode);
            }
        })
    }

    /** 获取二维码Blob对象实例
     * @param id Canvas画布id
     * @return blobInstance or {}
     */
    qrcode.getBlobInstance = (id) => {
        return qrcode.blobInstance[id] || {};
    }
    
    /** 获取二维码Canvas对象实例
     * @param id Canvas画布id
     * @return canvasInstance or {}
     */
    qrcode.getCanvasInstance = (id) => {
        return qrcode.canvasInstance[id] || {};
    }

    module.exports = qrcode;
}
