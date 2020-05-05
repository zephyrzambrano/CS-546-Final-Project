




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
    $.post('localhost:3000/homePage/search', {searchString: $('#tag-Men').text()}, function (response) {
        response.postArr;
    })
})

// This is to add comment in post page
$('#addComment').click(function () {
        $.post('localhost:3000/post/addComment',{postId: postInfo._id, userId: postInfo.userId, commentContent: $('#message-text').val()}, function (response) {
            response.commentInfo;
        })
        window.location.reload()
    })
