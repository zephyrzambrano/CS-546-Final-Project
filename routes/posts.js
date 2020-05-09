const express = require("express");
const router = express.Router();
const data = require("../data");
const postData = data.posts;
const userData = data.users;
const commentData = data.comments;

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.get('/postInfo/:id', async (req, res) => {//浏览器端发送一个普通的get请求，网址包含postId，返回渲染一个完整的posts网页（包含帖子内容和评论）
    try {
        let userLogin = null;
        if (req.session) {
            if (req.session.userId)
                userLogin = await userData.getUserById(req.session.userId);
        }
        await postData.addViewCount(req.params.id);//Each time this address is accessed, viewCount++
        let postInfo = await postData.getPostById(req.params.id);
        let temp = await userData.getUserById(postInfo.userId);
        postInfo.nickname = temp.nickname;
        let commentsInfo = [];
        for (let i = 0; i < postInfo.commentIdArr.length; i++) {
            let thisComment = await commentData.getCommentById(postInfo.commentIdArr[i]);
            let commentCreaterInfo = await userData.getUserById(thisComment.userId);
            thisComment.userNickname = commentCreaterInfo.nickname;
            commentsInfo.push(thisComment);
        }
        // res.json({ postInfo, commentsInfo, userLogin});
        res.render('posts/posts.handlebars', { postInfo, commentsInfo, userLogin });
    } catch (error) {
        res.redirect('/homePage')
        // res.status(404).json({ error: 'Post not found' });
    }
});

router.get('/like', async (req, res) => {//浏览器端发送一个Ajax的get请求，包含postId的参数，返回这个post更新后的详细数据（不包含comment）
    try {
        // console.log(req.query)
        if (!req.session)
            throw "you don't have the cookie"
        if (!req.session.userId)
            throw "login first,then like it"
        if (!req.query)
            throw "need info to like it";
        if (!req.query.postId)
            throw "need postId to like it";
        let updatedPost = await postData.addLikeCount(req.query.postId, req.session.userId);
        res.send(updatedPost);
    } catch (error) {
        // console.log(post)
        res.status(404).send(error);
    }
});

router.get('/dislike', async (req, res) => {//浏览器端发送一个Ajax的get请求，包含postId的参数，返回这个post更新后的详细数据（不包含comment）
    try {
        if (!req.session)
            throw "you don't have the cookie"
        if (!req.session.userId)
            throw "login first,then dislike it"
        if (!req.query)
            throw "need info to dislike it";
        if (!req.query.postId)
            throw "need postId to dislike it";
        let updatedPost = await postData.addDislikeCount(req.query.postId, req.session.userId);
        res.send(updatedPost);
    } catch (error) {
        res.status(404).send(error);
    }
});

router.post('/editContent', async (req, res) => {//（目前还在讨论）浏览器端发送一个普通的post请求，包含postId与新的content，返回更新后的post详细数据
    try {
        if (!req.session)
            throw "you don't have the cookie"
        if (!req.session.userId)
            throw "login first,then edit content"
        if (!req.body)
            throw "need new content and postId";
        if (!req.body.postId)
            throw "need postId";
        if (!req.body.newContent)
            throw "new Content";
        let postToEdit = await postData.getPostById(req.body.postId);//这里判断想要修改post content的人是不是真正的写这个post的人
        if (postToEdit.userId !== req.session.userId)//这里判断想要修改post content的人是不是真正的写这个post的人
            throw "Your id is not the same as the userId of the post!!"
        let updatedPost = await postData.editContent(req.body.postId, req.body.newContent);
        res.redirect("http://localhost:3000/users/account");
        // res.send(updatedPost);
    } catch (error) {
        res.status(404).send(error);
    }
});

router.post('/delete',async (req, res) =>{//浏览器端发一个ajax的get请求
    try{
        if(!req.session) throw 'you dont have session to delete the post'
        if(!req.session.userId) throw 'you dont have userId in session to delete the post'
        if(!req.body.postId) throw 'you dont have postId to delete the post'
        let postInfo=await postData.getPostById(req.body.postId);
        // console.log(postInfo);
        if(postInfo.userId!==req.session.userId) throw "the request maker's userId !== the post's userId"//判断用户一致性
        let postDelete = await postData.removePost(req.body.postId);
        // res.redirect("http://localhost:3000/users/account");
        res.send(postDelete);
        // if(postDelte)
        //     res.send(true);
        // else
        //     res.send(false);
    }catch(error){
        res.status(404).send(error);
    }
})

router.post('/addComment', async (req, res) => {//发送一个post请求，添加导commnet文档，重新刷新网页
    try {
        if (!req.session)
            throw "you don't have the cookie"
        if (!req.session.userId)
            throw "login first,then make commnet"
        if (!req.body)
            throw "need info to create a comment";
        if (!req.body.postId)
            throw "need postId to create a comment";
        if (!req.body.commentContent)
            throw "need commentContent to create a comment";
        let newComment = await commentData.addComment(req.body.postId, req.session.userId, req.body.commentContent)
        res.redirect("http://localhost:3000/posts/postInfo/"+req.body.postId);
    } catch (error) {
        res.status(404).send(error);
    }
});


module.exports = router;
