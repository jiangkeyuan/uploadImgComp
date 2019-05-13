        /*
        三个参数
        file：一个是文件(类型是图片格式)，
        w：一个是文件压缩的后宽度，宽度越小，字节越小
        objDiv：一个是容器或者回调函数
        photoCompress()
         */
        function photoCompress(file,w,objDiv){
          var ready=new FileReader();
          /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
          ready.readAsDataURL(file);
          ready.onload=function(){
              var re=this.result;
              canvasDataURL(re,w,objDiv)
          }
      }
      function canvasDataURL(path, obj, callback){
          var img = new Image();
          img.src = path;
          img.onload = function(){
              var that = this;
              // 默认按比例压缩
              var w = that.width,
                  h = that.height,
                  scale = w / h;
              w = obj.width || w;
              h = obj.height || (w / scale);
              var quality = 0.7;  // 默认图片质量为0.7
              //生成canvas
              var canvas = document.createElement('canvas');
              var ctx = canvas.getContext('2d');
              // 创建属性节点
              var anw = document.createAttribute("width");
              anw.nodeValue = w;
              var anh = document.createAttribute("height");
              anh.nodeValue = h;
              canvas.setAttributeNode(anw);
              canvas.setAttributeNode(anh);
              ctx.drawImage(that, 0, 0, w, h);
              // 图像质量
              if(obj.quality && obj.quality <= 1 && obj.quality > 0){
                  quality = obj.quality;
              }
              // quality值越小，所绘制出的图像越模糊
              var base64 = canvas.toDataURL('image/jpeg', quality);
              // 回调函数返回base64的值
              callback(base64);
          }
      }
      /**
       * 将以base64的图片url数据转换为Blob
       * @param urlData
       *            用url方式表示的base64图片数据
       */
      function convertBase64UrlToBlob(urlData){
          var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
          while(n--){
              u8arr[n] = bstr.charCodeAt(n);
          }
          return new Blob([u8arr], {type:mime});
      }
      var xhr;
      //上传文件方法
      function UpladFile(fileObj,url,quality,fileSize,callback) {
          var form = new FormData(); // FormData 对象
          if(fileObj.size/1024 > fileSize) { //大于fileSizeKb，进行压缩上传
              photoCompress(fileObj, {
                  quality:quality
              }, function(base64Codes){
                  //console.log("压缩后：" + base.length / 1024 + " " + base);
                  var bl = convertBase64UrlToBlob(base64Codes);
                  form.append("file", bl, "file_"+Date.parse(new Date())+".jpg"); // 文件对象
                  xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
                  xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
                  xhr.onload = function(){
                    var data = JSON.parse(this.responseText);
                    callback(data);
                  }; //请求完成
                  xhr.onerror =  uploadFailed; //请求失败

                  //xhr.upload.onprogress = progressFunction;//【上传进度调用方法实现】
                  xhr.upload.onloadstart = function(){//上传开始执行方法
                      // ot = new Date().getTime();   //设置上传开始时间
                      // oloaded = 0;//设置上传开始时，以上传的文件大小为0
                  };

                  xhr.send(form); //开始上传，发送form数据
              });
          }else{ //小于等于300k 原图上传
              form.append("file", fileObj); // 文件对象
              xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
              xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
              xhr.onload = xhr.onload = function(){
                var data = JSON.parse(this.responseText);
                callback(data);
              }; //请求完成
             
              xhr.onerror =  uploadFailed; //请求失败

              //xhr.upload.onprogress = progressFunction;//【上传进度调用方法实现】
              xhr.upload.onloadstart = function(){//上传开始执行方法
                //   ot = new Date().getTime();   //设置上传开始时间
                //   oloaded = 0;//设置上传开始时，以上传的文件大小为0
              };

              xhr.send(form); //开始上传，发送form数据
          }
      }
      //上传失败
      function uploadFailed(evt) {
          alert("上传失败！");
      }
      //取消上传
      function cancleUploadFile(){
          xhr.abort();
      }

  export default UpladFile;