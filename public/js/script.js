var form = document.getElementById('static-form');
var formData = new FormData(form);

formData.get('topic');
formData.get('content');

var tags = document.getElementsByName('tag');
console.log(tags);

var tagArr = [];

for(let i = 0; i<17; i++) {
    if(tags[i].checked) {
        tagArr.push(tags[i].value);
    }
}
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

$("#likeCount").click(function() {
    alert("You liked this post! :)")

    var currentLike = $("#likeCount").text();
    parseInt(currentLike);
    var newLike = currentLike + 1;

    var likeCount = new FormData(form);
    likeCount.set('likeCount',newLike);

    xhr.open('post', '网址');
    xhr.send(likeCount);
})

$("#dislikeCount").click(function() {
    alert("You disliked this post! :(")

    var currentDislike = $("#dislikeCount").text();
    parseInt(currentDislike);
    var newDislike = currentDislike + 1;

    var dislikeCount = new FormData(form);
    likeCount.set('dislikeCount',newDislike);

    xhr.open('post', '网址');
    xhr.send(dislikeCount);
})
