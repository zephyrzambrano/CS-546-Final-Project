const express = require("express");
const router = express.Router();
const data = require("../data");
const postData = data.posts;
const userData = data.users;
const commentData = data.comments;
const reportData = data.reports;

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.get('/postInfo/:id', async (req, res) => {
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

router.get('/like', async (req, res) => {
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

router.get('/dislike', async (req, res) => {
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

router.post('/editContent', async (req, res) => {
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
        let postToEdit = await postData.getPostById(req.body.postId);
        if (postToEdit.userId !== req.session.userId)//这里判断想要修改post content的人是不是真正的写这个post的人
            throw "Your id is not the same as the userId of the post!!"
        let updatedPost = await postData.editContent(req.body.postId, req.body.newContent);
        res.redirect("http://localhost:3000/users/account");
    } catch (error) {
        res.redirect("http://localhost:3000/users/account");
    }
});

router.post('/delete',async (req, res) =>{
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

router.post('/addComment', async (req, res) => {
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
        res.redirect("http://localhost:3000/posts/postInfo/"+req.body.postId);
    }
});

router.post('/deleteComment', async (req, res) => {
    try {
        
        if (!req.session)
            throw "you don't have the cookie to delete the comment"
        if (!req.session.userId)
            throw "login first,then delete commnet"
        if (!req.body)
            throw "need info to delete the comment";
        if (!req.body.postId)
            throw "need postId to delete the comment";
        if (!req.body.commentId)
            throw "need commentId to create the comment";
        await commentData.removeComment(req.body.postId,req.body.commentId);
        res.redirect("http://localhost:3000/posts/postInfo/"+req.body.postId);
    } catch (error) {
        res.status(404).send(error);
    }
});

router.post('/removeReport', async (req, res) => {//浏览器端发一个ajax的get请求
    try {
        //console.log(req.body.reportId);
        if (!req.session) throw 'you dont have session to delete the post'
        if (!req.session.userId) throw 'you dont have userId in session to delete the report'
        if (!req.body.reportId) throw 'you dont have reportId in body to delete the report'
        let deletePerson = await userData.getUserById(req.session.userId)
        let postDelete = null;
        if (deletePerson.admin === false)
            res.send("no access!!!")
        else {
            //res.send(req.body.reportId)
            // postDelete = await postData.removePost(req.body.postId);
            reportDelete = await reportData.removeReport(req.body.reportId);
            res.send(reportDelete);
        }

    } catch (error) {
        res.status(404).send(error);
    }
})

router.post('/removeReportAndPost', async (req, res) => {
    try {
        //console.log(req.body.reportId);
        if (!req.session) throw 'you dont have session to delete the post'
        if (!req.session.userId) throw 'you dont have userId in session to delete the report'
        if (!req.body.reportId) throw 'you dont have reportId in body to delete the report'
        let deletePerson = await userData.getUserById(req.session.userId)
        let postDelete = null;
        if (deletePerson.admin === false)
            res.send("no access!!!")
        else {
            //res.send(req.body.reportId,req.body.postId)
            postDelete = await postData.removePost(req.body.postId);
            reportDelete = await reportData.removeReport(req.body.reportId);
            res.send(true);
        }

    } catch (error) {
        res.status(404).send(error);
    }
})

module.exports = router;
