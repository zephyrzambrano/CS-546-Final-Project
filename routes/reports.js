const express = require("express");
const router = express.Router();
const data = require("../data");
const reportData = data.reports;
const userData = data.users;
const postData = data.posts;
const commentData = data.comments;

module.exports = router;


router.get("/form", async (req, res) => {
  if (!req.session.userId) {   
    return res.redirect('/homePage');
  }
  try{
    const userId = req.session.userId;
    const userLogin = await userData.getUserById(userId);
    const postId = req.query.id;
    const post = await postData.getPostById(postId);
    res.render('reports/report-form',{userLogin,'reported-post':post.topic, 'postId': postId});
  }catch(e){
    res.status(404).json({ error: e });
  }
});
router.post("/form", async (req, res) => {
  const userId = req.session.userId;
  const userLogin = await userData.getUserById(userId);
  const postId=req.body.postId;
  const post = await postData.getPostById(postId);
    try
    {
        let reason = req.body.reason;
        if(typeof reason == "string")
        {
          reason=[reason];
        }
        await reportData.addReport(userId,postId,reason);
        res.render('reports/report-form',{success:"Report successfully submitted!", userLogin,'reported-post':post.topic, 'postId': postId});
        return;
    }
    catch(e)
    {
      res.render('reports/report-form',{message:e, userLogin,'reported-post':post.topic, 'postId': postId});
    } 
});

router.get('/statistic', async (req, res) => {
  if (req.session && req.session.userId) {
    let userLogin = await userData.getUserById(req.session.userId)
    if (userLogin.Admin) {
      try {
        let allPosts = await postData.getAllPost();
        let allUsers = await userData.getAllUsers();
        let allComments = await commentData.getAllComments();
        res.render('statistics/statistics',{ allPosts,allUsers, allComments,userLogin });
      } catch (error) {
        res.status(404).send(error);
      }
    }
    else
      res.redirect('/homePage');
  }
  else
    res.redirect('/homePage');
})

router.get("/:id", async (req, res) => {
    try {
      const report = await reportData.getReport(req.params.id);
      res.status(200).json(report);
    } catch (e) {
      res.status(404).json({ message: "Report not found" });
    }
  });

router.get("/", async (req, res) => {
  if (req.session && req.session.userId) {
    let userLogin = await userData.getUserById(req.session.userId);
    if (userLogin.Admin) {
      try {
        const reportList = await reportData.getAllReports();
        res.render('reports/reportList',{reportList,userLogin});
      } catch (error) {
        res.status(404).send(error);
      }
    }
    else
      res.redirect('/homePage');
  }
  else
    res.redirect('/homePage');
});


