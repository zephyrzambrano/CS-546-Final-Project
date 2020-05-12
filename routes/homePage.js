const express = require("express");
const path = require("path")
const router = express.Router();
const data = require("../data");
const postData = data.posts;
const userData = data.users;
const commentData = data.comments;
const formidable = require('formidable');


router.get('/', async (req, res) => {
    try {
        let userLogin = null;
        if (req.session) {
            if (req.session.userId)
                userLogin = await userData.getUserById(req.session.userId);
        }
        let postArr = await postData.getAllPost();
        for (let i = 0; i < postArr.length; i++) {
            let temp = await userData.getUserById(postArr[i].userId);
            postArr[i].userNickname = temp.nickname;
        }
        postArr.sort((a,b)=>{
            return (b.viewCount-a.viewCount);
        })
        // res.send({ postArr, userLogin });
        res.render('home/home.handlebars', { postArr, userLogin });
    } catch (error) {
        res.redirect('/homePage');
        // res.status(404).send(error);
    }
});


router.get('/tag', async (req, res) => {
    try {
        let userLogin = null;
        if (req.session) {
            if (req.session.userId)
                userLogin = await userData.getUserById(req.session.userId);
        }
        if (!req.query)
            throw "need tagInfo";
        if (!req.query.searchTag)
            throw "need a tag";
        
        let postArr = await postData.getPostByOneTag(req.query.searchTag);
        res.render('home/home.handlebars', { postArr, userLogin });
    } catch (error) {
        res.status(404).send(error);
    }
});

router.get("/search", async (req, res) => {
    try { // search?searchString=xxxx
        let userLogin = null;
        if (req.session) {
            if (req.session.userId)
                userLogin = await userData.getUserById(req.session.userId);
        }
        if (!req.query)
            throw "need string to search";
        if (!req.query.searchString)
            throw "need string to search!";
        let postArr = await postData.getPostByString(req.query.searchString);
        res.render('home/home.handlebars', { postArr, userLogin });
    } catch (error) {
        res.redirect('/homePage')
       
    }
})

router.post('/createPost', async (req, res) => {
    let userLogin = null;
    if (req.session) {
        if (req.session.userId)
            userLogin = await userData.getUserById(req.session.userId);
    }
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../', 'public', 'images');
    form.keepExtensions = true;//保留后缀名
    form.parse(req, async (err, fields, files) => {
        
        try {
            if (!fields)
                throw "need data to create post";
            if (!fields.topic)//标题
                throw "need topic to create post "
            if (!fields.content)//文本内容
                throw "need content to create post"
            if (!fields.tagArr)//标签数组
                throw "need a tagArr String to create post";
            let tagArr = JSON.parse(fields.tagArr);
            if (!Array.isArray(tagArr))
                throw "need a tagArr to create post";
            let photoArr = [];

            if (files.photo0)
                photoArr.push("http://localhost:3000/public/images/" + files.photo0.path.split('images\\')[1]);
            if (files.photo1)
                photoArr.push("http://localhost:3000/public/images/" + files.photo1.path.split('images\\')[1]);
            if (files.photo2)
                photoArr.push("http://localhost:3000/public/images/" + files.photo2.path.split('images\\')[1]);
            
            let newPost = await postData.createPost(
                fields.topic,
                req.session.userId,
                fields.content,
                photoArr,
                tagArr
            )
            res.send(newPost);
        } catch (error) {
            res.status(404).send(error);
        }
    })
});

module.exports = router;
