module.exports = Utils = {
    /**
     * 浏览器环境检测，要求支持以下特性
     * 
     */
    browserDetection() {
        if(!window) {
            console.error(`[byted-qrcode-generator] browser enviroment supported only.`);
            return false;
        } else {
            if(!(typeof window.FormData === 'function') ||
               !(typeof window.atob === 'function') ||
               !(typeof window.ArrayBuffer === 'function') ||
               !(typeof window.Uint8Array === 'function') ||
               !(typeof window.Blob === 'function')
            ) {
                console.error(`[byted-qrcode-generator] the current browser does not support these functions: [FormData, atob, ArrayBuffer, Uint8Array, Blob], please update.`);
                return false;
            } else {
                return true;
            }
        }
    },

    /**
     * DOM节点校验
     * @param {string} dom_id 
     * @returns
     */
    domValidate(dom_id) {
        var dom = document.getElementById(dom_id);
        if(!dom) {
            console.error(`[byted-qrcode-generator] cannot find the DOM element named '${dom_id}'.`);
            return {
                status: false,
                result: null
            };
        } else {
            if(dom.nodeName.toLowerCase() !== "canvas") {
                console.error(`[byted-qrcode-generator] the DOM element specified is not a CANVAS.`);
                return {
                    status: false,
                    result: dom
                };
            } else {
                return {
                    status: true,
                    result: dom
                };
            }
        }
    },

    /**
     * 将以base64的图片url数据转换为Blob
     * @param {string} urlData 用url方式表示的base64图片数据
     * @returns 
     */
    convertBase64UrlToBlob(urlData) {
        //去掉url头，并转换为byte
        let bytes = window.atob(urlData.split(',')[1]);        
        //处理异常,将ascii码小于0的转换为大于0
        let ab = new ArrayBuffer(bytes.length);
        let ia = new Uint8Array(ab);
        for (var i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob( [ab] , {type : 'image/png'});
    },
}