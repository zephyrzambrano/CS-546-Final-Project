const express = require("express");
const router = express.Router();
const data = require("../data");
const reportData = data.reports;
const userData = data.users;
const postData = data.posts;

module.exports = router;


router.get("/form", async (req, res) => {
  if (!req.session.userId) {		//if not logged in, redirect to the homepage
    return res.redirect('/homePage');
  }
  


  try{
    const userId = req.session.userId;
    const userLogin = await userData.getUserById(userId);
    // const post = await postData.getPostById(postId);
    const mockTopic = await postData.getPostById("5eb2227cc74479564c3d93cc");//mock
    res.render('reports/report-form',{userLogin,'reported-post':mockTopic.topic});
    // res.render('reports/report-form',{userLogin,'reported-post':post.topic});
  }catch(e){
    res.status(404).json({ error: e });
  }
});

router.post("/form", async (req, res) => {
  const userId = req.session.userId;
  const userLogin = await userData.getUserById(userId);
  const mockTopic = await postData.getPostById("5eb2227cc74479564c3d93cc");//mock
  //const post = await postData.getPostById(postId);
    try
    {
      if(Object.keys(req.body).length!=0)
      {
        let reason = req.body.reason;
        if(typeof reason == "string")
        {
          reason=[reason];
        }
        await reportData.addReport(userId,"5eb2227cc74479564c3d93cc",reason); //mock postId
        // await reportData.addReport(userId,post._id,reason);
        res.render('reports/report-submitted',{userLogin});
        return;
      }
      else
      {
        throw `Error: You must select a reason for reporting a post!`;
      }
    }
    catch(e)
    {
      res.render('reports/report-form',{noReason:true, message:e, userLogin,'reported-post':mockTopic.topic});//mock postTopic
      // res.render('reports/report-form',{noReason:true, message:e, userLogin,'reported-post':post.topic});
    } 
});


router.get("/:id", async (req, res) => {
    try {
      const report = await reportData.getReport(req.params.id);
      res.status(200).json(report);
    } catch (e) {
      res.status(404).json({ message: "Report not found" });
    }
  });

  router.get("/", async (req, res) => {
    try {
      const reportsList = await reportData.getAllReports();
      res.json(reportsList);
    } catch (e) {
      res.status(500).send();
    }
});

