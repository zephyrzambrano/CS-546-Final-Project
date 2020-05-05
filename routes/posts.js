const express = require("express");
const router = express.Router();
const data = require("../data");
const postData = data.posts;
const userData = data.users;
const commentData = data.comments;

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.get('/:id', async (req, res) => {
    try {
        let userLogin=null;
        if(req.session.userId)
            userLogin=await userData.getUserById(req.session.userId);
        await postData.addViewCount(req.params.id);//Each time this address is accessed, viewCount++
        let postInfo = await postData.getPostById(req.params.id);
        let commentsInfo = [];
        for (let i = 0; i < postInfo.commentIdArr.length; i++) {
            let thisComment = await commentData.getCommentById(postInfo.commentIdArr[i]);
            let commentCreaterInfo = await userData.getUserById(thisComment.userId);
            thisComment.userNickname = commentCreaterInfo.nickname;
            commentsInfo.push(thisComment);
        }
        // res.send({ postInfo, commentsInfo, userLogin});
        res.render('posts/posts.handlebars',{
            postInfo,
            commentsInfo,
            userLogin
        });
    } catch (error) {
        res.status(404).json({ error: 'Post not found' });
    }
});

router.post('/like', async (req, res) => {
    try {
        if (!req.body)
            throw "need userId and postId";
        if (!req.body.postId)
            throw "need postId";
        if (!req.body.userId)
            throw "need userId";
        let updatedPost = await postData.addLikeCount(req.body.postId, req.body.userId);
        res.send(updatedPost);
    } catch (error) {
        res.status(404).send(error);
    }
});

router.post('/dislike', async (req, res) => {
    try {
        if (!req.body)
            throw "need userId and postId";
        if (!req.body.postId)
            throw "need postId";
        if (!req.body.userId)
            throw "need userId";
        let updatedPost = await postData.addLikeCount(req.body.postId, req.body.userId);
        res.send(updatedPost);
    } catch (error) {
        res.status(404).send(error);
    }
});

router.post('/editConetent', async (req, res) => {
    try {
        if (!req.body)
            throw "need new content and postId";
        if (!req.body.postId)
            throw "need postId";
        if (!req.body.newContent)
            throw "need userId";
        let updatedPost = await postData.editContent(req.body.postId, req.body.newConetent)
        res.send(updatedPost);
    } catch (error) {
        res.status(404).send(error);
    }
});

router.post('/addComment', async (req, res) => {
    try {
        if (!req.body)
            throw "need userId postId commentContent to create a comment";
        if (!req.body.postId)
            throw "need postId to create a comment";
        if (!req.body.userId)
            throw "need userId to create a comment";
        if (!req.body.commentContent)
            throw "need commentContent to create a comment";
        let newComment=await commentData.addComment(req.body.postId,req.body.userId,req.body.commentContent)
        res.send(newComment);
    } catch (error) {
        res.status(404).send(error);
    }
});


module.exports = router;
