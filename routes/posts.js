const express = require("express");
const router = express.Router();
const data = require("../data");
const postData = data.posts;

router.get('/:id', async (req, res) => {
    try {
        let user = await postData.getPostById(req.params.id);
        res.json(user);//render the post here
    } catch (e) {
        res.status(404).json({ error: 'Post not found' });
    }
});

router.get('/tag', async (req, res) => {
    try {
        let tagInReq = req.query["tag"];
        let postIncludeTag = await postData.getPostByOneTag(tagInReq);
        res.json(postIncludeTag);//render the post here
    } catch (e) {
        res.status(404).json({ error: 'Post not found with that tag' });
    }
});

router.post('/createPost', async (req, res) => {
    let postInfo = req.body;

    if (!postInfo) {
        res.status(400).json({ error: 'You must provide data to create a post' });
        return;
    }

    if (!postInfo.userId) {
        res.status(400).json({ error: 'You must provide a userId to create a post' });
        return;
    }

    if (!postInfo.content) {
        res.status(400).json({ error: 'You must provide a content to create a post' });
        return;
    }

    if (!postInfo.photoArr) {
        res.status(400).json({ error: 'You must provide a photo array to create a post' });
        return;
    }

    if (!postInfo.tagArr) {
        res.status(400).json({ error: 'You must provide a tag array to create a post' });
        return;
    }

    try {
        let newPost = await postData.createPost(postInfo.topic, postInfo.userId, postInfo.content, postInfo.photoArr, postInfo.tagArr);
        res.json(newPost);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.patch('/editPost', async (req, res) => {
    let postInfo = req.body;

    if (!postInfo) {
        res.status(400).json({ error: 'You must provide data to edit a post' });
        return;
    }
    if (!postInfo.postId) {
        res.status(400).json({ error: 'You must provide a postId to edit a post' });
        return;
    }
    if (!postInfo.newContent) {
        res.status(400).json({ error: 'You must provide a content to edit a post' });
        return;
    }

    try {
        let updatedContent = await postData.editContent(postInfo.postId, postInfo.newContent);
        res.json(updatedContent);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.patch('/addLikeCount', async (req, res) => {
    let postInfo = req.body;

    if (!postInfo) {
        res.status(400).json({ error: 'You must provide data to edit a post' });
        return;
    }
    if (!postInfo.postId) {
        res.status(400).json({ error: 'You must provide a postId to edit a post' });
        return;
    }
    if (!postInfo.userId) {
        res.status(400).json({ error: 'You must provide a content to edit a post' });
        return;
    }

    try {
        let updatedLikeCount = await postData.addLikeCount(postInfo.postId, postInfo.userId)
        res.json(updatedLikeCount);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.patch('/addDislikeCount', async (req, res) => {
    let postInfo = req.body;

    if (!postInfo) {
        res.status(400).json({ error: 'You must provide data to edit a post' });
        return;
    }
    if (!postInfo.postId) {
        res.status(400).json({ error: 'You must provide a postId to edit a post' });
        return;
    }
    if (!postInfo.userId) {
        res.status(400).json({ error: 'You must provide a content to edit a post' });
        return;
    }

    try {
        let updatedDislikeCount = await postData.addDislikeCount(postInfo.postId, postInfo.userId)
        res.json(updatedDislikeCount);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.patch('/viewCount', async (req, res) => {
    let postInfo = req.body;

    if (!postInfo) {
        res.status(400).json({ error: 'You must provide data to edit a post' });
        return;
    }
    if (!postInfo.postId) {
        res.status(400).json({ error: 'You must provide a postId to edit a post' });
        return;
    }

    try {
        let updatedViewCount = await postData.addViewCount(postInfo.postId);
        res.json(updatedViewCount);
    } catch (e) {
        res.sendStatus(500);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let deletedPost = await postData.removeCommentIdFromPost(req.params.id);
        res.json(deletedPost);
    } catch (e) {
        res.sendStatus(500);
    }
});

module.exports = router;
