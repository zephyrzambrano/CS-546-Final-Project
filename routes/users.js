const express = require("express");
const router = express.Router();
const data = require("../data");
const bcrypt = require('bcryptjs');
const saltRounds = 5;
const userData = data.users;
const postData = data.posts;

router.get('/account', async (req, res) => {
    if (!req.session.userId) {		
		return res.redirect('/homePage');
	}
	try{
		const userId = req.session.userId;  
		const userLogin = await userData.getUserById(userId);
		let posts=[];
		for(let x of userLogin.posts)
		{
			const onePost = await postData.getPostById(x);
			posts.push(onePost);
		}
		res.render('users/useraccount',{username: userLogin.username, nickname: userLogin.nickname, 'post-list':posts, userLogin});
	}catch(e){
		res.status(404).json({ error: 'User not found' });
	}
	
});

router.get('/signin', async (req, res) => {
	if (req.session.userId) {		
		return res.redirect('/homePage');
	}
    res.render('home/signin');
});

router.post('/signin', async (req, res) => {
	if (req.session.userId) {		
		return res.redirect('/homePage');
	}
	const { username, password } = req.body;
	const allUser = await userData.getAllUsers();
	for (let x of allUser)
    {
		if(username == x.username)
        {
			if(await bcrypt.compare(password, x.password))   
            {
				req.session.userId = x._id.toHexString(); 
                return res.redirect('/homePage');
			}
            break;
        }
    }
    res.status(401).render('home/signin',{message:"Invalid account or password"});
});

router.get('/signup', async (req, res) => {
    if (req.session.userId) {		
		return res.redirect('/homePage');
	}
	res.render('home/signup');
});

router.post('/signup', async (req, res) => {
	const { username,nickname,password} = req.body;
	try{
		if (!username) {
			throw `You must provide a username`
		}
		if (!nickname) {
			throw `You must provide a nickname`
		}
		if (!password[0]) {
			throw `You must provide a password`
		}
		if (!password[1]) {
			throw `You must provide a confirm password`
		}
		if(password[0]!=password[1])
		{
			throw `Password don't match`
		}
  		const hash = await bcrypt.hash(password[0], saltRounds);
		const newUser = await userData.createUser(username,hash,nickname);
		req.session.userId = newUser._id.toHexString(); 
        return res.redirect('/homePage');
	}catch(e)
	{
		res.status(404).render('home/signup',{message:e});
	}
});

router.get('/signout', async (req, res) => {
	if (!req.session.userId) {		
		return res.redirect('/homePage');
	}
	req.session.destroy();
    return res.redirect('/homePage');
});

router.post('/account', async (req, res) => { 
	let { username, password,Cpassword,nickname } = req.body;
	const userId = req.session.userId; 
	let oldUser;
	let posts=[];
	try {
		oldUser = await userData.getUserById(userId);
	} catch (e) {
		res.status(404).json({ error: 'User not found' });
		return;
	}
	try {
		let success1;
		let success2;
		let success3;
		if (username == oldUser.username) throw "You have to submit different username"; 
		if (password == oldUser.password) throw "You have to submit different password";
		if (password != Cpassword) throw"Password don't match"
		if (nickname == oldUser.nickname) throw "You have to submit different nickname";
		if(username)
		{
			await userData.editUsername(userId, username );
			success1 ="Username has been updated";
		}else if(password)
		{
			const hash = await bcrypt.hash(password, saltRounds);
			await userData.editPassword(userId, hash );
			success3 ="Password has been updated";
		}else if(nickname)
		{
			await userData.editNickname(userId, nickname );
			success2 ="Nickname has been updated";
		}
		else throw`You have to submit different inputs before pushing button`;
		let updatedUser = await userData.getUserById(userId);
		for(let x of updatedUser.posts)
		{
			const onePost = await postData.getPostById(x);
			posts.push(onePost);
		}
		res.render('users/useraccount',{username: updatedUser.username, nickname: updatedUser.nickname, 'post-list':posts, success1:success1,success2:success2,success3:success3, userLogin: updatedUser});
	} catch (e) { 
		let message1;
		let message2;
		let message3;
		let message4;
		if(e =="You have to submit different username")message1 ="You have to submit different username";
		if(e =="the username is already exisited")message1 ="the username is already exisited";
		if(e =="You have to submit different nickname")message2="You have to submit different nickname";
		if(e=="the nickname is already exisited")message2="the nickname is already exisited"
		if(e =="You have to submit different password")message3="You have to submit different password";
		if(e =="Password don't match")message3="Password don't match";
		if(e =="You have to submit different inputs before pushing button")message4="You have to submit different inputs before pushing button";
		const oldUsername = oldUser.username;
		const oldNickname = oldUser.nickname;
		for(let x of oldUser.posts)
		{
			const onePost = await postData.getPostById(x);
			posts.push(onePost);
		}
		res.status(404).render('users/useraccount',{username: oldUsername, nickname: oldNickname, 'post-list':posts, message1:message1, message2:message2, message3:message3, message4:message4, userLogin: oldUser});
	}
});


router.get("/", async (req, res) => {
	try {
      const userList = await userData.getAllUsers();
      res.json(userList);
    } catch (e) {
      res.status(500).send();
    }
});

module.exports = router;