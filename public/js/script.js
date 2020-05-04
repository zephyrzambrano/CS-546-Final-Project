
// This is to transport data in "Add new post"
var form = document.getElementById('static-form');
var formData = new FormData(form);

formData.get('topic');
formData.get('content');

$('input[type="checkbox"]:checked').each(function(index) {
    var tagArr = [];
    tagArr[index] = $(this).val();
})

let JSONData = JSON.stringify(tagArr);
formData.set('tag', JSONData);

var file = document.getElementById('addImg')
// 当用户选择文件的时候
file.onchange = function () {
    formData.append('photoArr', this.files[0]); // 将用户选择的二进制文件追加到表单对象中
}
xhr.open('post', '/createPost');
xhr.send(formData);


// This is to add like or dislike counts in post page
$("#likeCount").click(function() {
    $.get('localhost:3000/post/like', {postId: postInfo._id, userId: postInfo.userId}, function (response) {
        if (response.likeCount) {
            $('#likeCount').text(response.likeCount.length)
        } else {
            alert(response)
        }
    })
})

$("#dislikeCount").click(function() {
    $.get('localhost:3000/post/dislike', {postId: postInfo._id, userId: postInfo.userId}, function (response) {
        if (response.dislikeCount) {
            $('#dislikeCount').text(response.dislikeCount.length)
        } else {
            alert(response)
        }
    })
})

// This is search by categories
$('#tag-Men').click(function () {
    $.post('localhost:3000/search', {searchString: $('#tag-Men').text()}, function (response) {
        response.postArr;
    })
})

// This is to add comment in post page
$('#addComment').click(function () {
        $.post('localhost:3000/post/addComment',{postId: postInfo._id, userId: postInfo.userId, commentContent: $('#message-text').val()}, function (response) {
            response.commentInfo;
        })
    })
