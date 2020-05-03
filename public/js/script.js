var form = document.getElementById('static-form');
var formData = new FormData(form);

formData.get('topic');
formData.get('content');

var tagArr = document.getElementsByName('tag');
console.log(tagArr);

// for(let i = 0; i<17; i++){
//
// }
var file = document.getElementById('addImg')
// 当用户选择文件的时候
file.onchange = function () {
    var formData = new FormData();// 创建空表单对象
    formData.append('photoArr', this.files); // 将用户选择的二进制文件追加到表单对象中
    xhr.open('post', '路由');// 配置ajax对象，请求方式必须为post
    xhr.send(formData);
}
xhr.open('post', '网址');
xhr.send(formData);
