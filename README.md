# Vue 插件格式
### main.js
```javascript
  import upladimgcomp from 'upladimgcomp';
  Vue.prototype.$upladimgcomp = upladimgcomp;
```
###在组件种使用
```javascript
upladimgcomp(fileObj,url,quality,fileSize,function(res){

})
```

* fileObj : 图片文件信息 参数是一个对象  
* url : 上传 url 
* quality : 压缩质量
* fileSize : 大于多少KB才压缩
* call : 成功回调函数 参数上传成功后台返回的值
* 
* 

### fileObje 参数格式
 ```javascript
 File{
    uid: 1557406508089, 
    name: "5b4d9b915417b.png", 
    lastModified: 1532598508000, 
    lastModifiedDate: Thu Jul 26 2018 17:48:28 GMT+0800 (中国标准时间), 
 ```


### 基于二次封装插件
* https://www.cnblogs.com/007sx/p/7583202.html

