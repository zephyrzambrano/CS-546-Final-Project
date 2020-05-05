const express = require("express");
const router = express.Router();
const data = require("../data");
const reportData = data.reports;

module.exports = router;


router.get("/form", async (req, res) => {
  // if (!req.session.user) {		//if not logged in, redirect to the homepage
	// 	return res.redirect('/homePage');
	// }
    res.render('reports/report-form');
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

router.post("/", async (req, res) => {
    const postReportData = req.body;
    if (!postReportData.userId) {
      res.status(400).json({ error: 'You must provide an user id for report' });
      return;
    }
    if (!postReportData.postId) {
      res.status(400).json({ error: 'You must provide a post id for report' });
      return;
    }
    if (!postReportData.reason) {
      res.status(400).json({ error: 'You must provide reason for report' });
      return;
    }
    try {
      const {userId, postId, reason} = postReportData;
      const newReport = await reportData.addReport(userId, postId, reason);
      res.status(200).json(newReport);
    } catch (e) {
      res.status(400).json({ error: e });
    }
});