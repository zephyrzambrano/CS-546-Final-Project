const express = require("express");
const router = express.Router();
const data = require("../data");
const reportData = data.reports;
const userData = data.users;
const postData = data.posts;
const commentData = data.comments;

module.exports = router;


router.get("/form", async (req, res) => {
  if (!req.session.userId) {    //if not logged in, redirect to the homepage
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
    let userInfo = await userData.getUserById(req.session.userId)
    console.log(userInfo);
    if (userInfo.Admin) {
      try {
        let allPosts = await postData.getAllPost();
        let allUsers = await userData.getAllUsers();
        let allRepots = await reportData.getAllReports();
        let allComments = await commentData.getAllComments();
        res.render('reports/stastic.handlebars'), { allPosts, allRepots, allUsers, allComments };
      } catch (error) {
        res.status(404).send(error);
      }
    }
    else
      res.redirect('/homePage');
    // res.status(404).send('you dont have access to statistic page');
  }
  else
    res.redirect('/homePage');
  // res.status(404).send('you dont have session to statistic page');
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
    let userInfo = await userData.getUserById(req.session.userId)
    if (userInfo.Admin) {
      try {
        const reportList = await reportData.getAllReports();
        res.render('reports/reportList',{reportList});
      } catch (error) {
        res.status(404).send(error);
      }
    }
    else
      res.redirect('/homePage');
    // res.status(404).send('you dont have access to report list page');
  }
  else
    res.redirect('/homePage');
  // res.status(404).send('you dont have session to report list page');
});


