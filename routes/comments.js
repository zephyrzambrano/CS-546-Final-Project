const express = require('express');
const router = express.Router();
const data = require("../data");
const commentData = data.comments;
const postData = data.posts;

router.get("/:id",async function(req,res) {
    try{
        const commentInfo = await commentData.getComment(req.params.id); // title, user(id), post(id), content, time
        // console.log(req.params.id)
        res.json(commentInfo);
    }
    catch(e){
        res.status(404).json({message:"'Comment' item not found!"});
    }
});

router.get("/",async function(req,res) {
    try{
        const commentList = await commentData.getAll();
        res.json(commentList);
    }
    catch(e){
        res.status(500).send();
    }
});

router.post("/", async(req, res) => { // add
    let commentInfo = req.body;
    if (!commentInfo) {
        res.status(400).json({ error: 'You must provide data to create a comment' });
        return;
      }

    const {title, user, post, content} = commentInfo;
    if (!title || typeof title !== 'string') {
        res.status(400).json({ error: 'You must provide a title(String) for the comment' });
        return;
    }
    if (!user) {
        res.status(400).json({ error: 'You must provide user id for the comment' });
        return;
    }
    if (!post) {
        res.status(400).json({ error: 'You must provide post id for the comment' });
        return;
    }
    if (!content || typeof content !== 'string') {
        res.status(400).json({ error: 'Comment content can not be empty.' });
        return;
    }

    try {
        const newComment = await commentData.addComment(title, user, post, content);
        res.status(200).send(newComment)
    }catch(e){
        res.status(500).json({error:e})
    }
});

router.delete("/:id", async (req, res) => {
    try {
      await commentData.getComment(req.params.id);
    } catch (e) {
      res.status(404).json({ error: "No Comment found" });
    }
    try {
      const msg = await commentData.remove(req.params.id);
      res.status(200).send(msg)
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  // this function should be added into "data/posts.js"
  async function getListOfCommentsInPost(postId){
    const thisPost = await post.getPost(postId);
    const listOfComments = thisPost.comments; // an array of IDs
    return listOfComments;
  }


module.exports = router;




