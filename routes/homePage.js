const express = require("express");
const path = require("path")
const router = express.Router();
const data = require("../data");
const postData = data.posts;
const userData = data.users;
const commentData = data.comments;
const formidable = require('formidable');


router.get('/', async (req, res) => {//通过浏览器地址访问，返回渲染完整的post 数组信息，数组内每个元素包含post详细信息与创建此post的userNickname
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
        // res.send({ postArr, userLogin });
        res.render('home/home.handlebars', { postArr, userLogin });
    } catch (error) {
        res.status(404).send(error);
    }
});


router.get('/tag', async (req, res) => {//通过点击主页的tag发送普通get请求，返回重新渲染网页，就像之前一样
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
        // console.log(req.query.searchTag);
        let postArr = await postData.getPostByOneTag(req.query.searchTag);

        // console.log(postArr);
        // res.send(postArr);
        res.render('home/home.handlebars', { postArr, userLogin });
    } catch (error) {
        res.status(404).send(error);
    }
});

router.get("/search", async (req, res) => {//通过主页浏览框输入发送普通get请求，返回重新渲染网页，就像之前一样
    try {
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
        res.status(404).send(error);
    }
})

router.post('/createPost', async (req, res) => {//通过post方式发一个Ajax请求（但还是会刷新网页），返回重新渲染一个网页，包含了最新的post
    let userLogin = null;
    if (req.session) {
        if (req.session.userId)
            userLogin = await userData.getUserById(req.session.userId);
    }
    const form = new formidable.IncomingForm();//创建formidable解析器
    form.uploadDir = path.join(__dirname, '../', 'public', 'images');//设置上传的存储路径
    form.keepExtensions = true;//保留后缀名
    form.parse(req, async (err, fields, files) => {
        // console.log(err);
        // console.log(fields);
        // console.log(files);
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
            // console.log(photoArr);
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
