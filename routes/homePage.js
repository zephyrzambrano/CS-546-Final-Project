const express = require("express");
const router = express.Router();
const data = require("../data");
const postData = data.posts;
const userData = data.users;
const commentData = data.comments;
const formidable = require('formidable');


router.get('/', async (req, res) => { // √
    try {
        // console.log("aaa");
        let userLogin = null;
        if(req.session){
            if (req.session.userId)
                userLogin = await userData.getUserById(req.session.userId);
        }
        let postArr = await postData.getAllPost();
        for (let i = 0; i < postArr.length; i++) {
            let temp = await userData.getUserById(postArr[i].userId);
            postArr[i].userNickname = temp.nickname;
        }
        // res.send({ postArr, userLogin });
        // console.log(Array.isArray(postArr))
         res.render('home/home.handlebars',{
            postArr,
            userLogin
        });
    } catch (error) {
        res.status(404).send(error);
    }
});

router.get('/tag', async (req, res) => { // √
    try {
        if (!req.query)
            throw "need tag info";
        if (!req.query.searchTag)
            throw "need a tag";
        // console.log(req.query.searchTag);
        let postArr = await postData.getPostByOneTag(req.query.searchTag);
        // console.log(postArr);
        // res.send(postArr);
        res.render("home/home.handlebars",{
            postArr
        })
    } catch (error) {
        res.status(404).send(error);
    }
});

router.get("/search", async (req, res) => { // √
    try {
        // console.log("------------")
        if (!req.query)
            throw "need string to search";
        if (!req.query.searchString)
            throw "need string to search!";
        let postArr = await postData.getPostByString(req.query.searchString);
        // console.log(postArr)
        // res.send(postArr);
        res.render('home/home.handlebars',{
            postArr
        });
    } catch (error) {
        res.status(404).send(error);
    }
})

router.post('/createPost', async (req, res) => {//这是靠谱写法
    const form = new formidable.IncomingForm();//创建formidable解析器
    form.uploadDir = path.join(__dirname, '../', 'public', 'images');//设置上传的存储路径
    form.keepExtensions = true;//保留后缀名
    form.parse(req, async (err, fields, files) => {
        try {
            if (!fields)
                throw "need data to create post";
            if (!fields.topic)
                throw "need topic to create post "
            if (!fields.userId)
                throw "need userId to create post"
            if (!fields.content)
                throw "need content to create post"
            if (!fields.tagArr || !Array.isArray(fields.tagArr))
                throw "need a tagArr to create post";

            let photoArr = [];
            if (files.photo1)
                photoArr.push(files.photo1.path.split('public')[1]);
            if (files.photo2)
                photoArr.push(files.photo2.path.split('public')[1]);
            if (files.photo3)
                photoArr.push(files.photo3.path.split('public')[1]);

            files.xxx.path.split('public')[1];
            let newPost = await postData.createPost(
                fields.topic,
                fields.userId,
                fields.content,
                photoArr,
                fields.tagArr
            )
            res.send(newPost);
        } catch (error) {
            res.status(404).send(error);
        }
    })
});

module.exports = router;

// router.post('/createPost', async (req, res) => {//这里写的有问题，要上传文件的话需要配合前端使用formidable和FormData进行上传
    //     try {
    //         if (!req.body)
    //             throw "need data to create post";
    //         if (!req.body.topic)
    //             throw "need topic to create post "
    //         if (!req.body.userId)
    //             throw "need userId to create post"
    //         if (!req.body.content)
    //             throw "need content to create post"
    //         if (!req.body.photoArr || !Array.isArray(req.body.photoArr))
    //             throw "need a photo array to create post";
    //         if (!req.body.tagArr || !Array.isArray(req.body.tagArr))
    //             throw "need a tagArr to create post";

    //         let newPost = await postData.createPost(
    //             req.body.topic,
    //             req.body.userId,
    //             req.body.content,
    //             req.body.photoArr,
    //             req.body.tagArr
    //         )
    //         res.send(newPost);
    //     } catch (error) {
    //         res.status(404).send(error);
    //     }
    // });
