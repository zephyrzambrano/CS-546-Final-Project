const express = require("express");
const router = express.Router();
const data = require("../data");
const bcrypt = require('bcryptjs');
const saltRounds = 5;
const userData = data.users;

router.get('/account', async (req, res) => {
    if (!req.session.user) {		//if not logged in, redirect to the homepage
		return res.redirect('/homePage');
	}
	try{
		const {userId} = req.session.user;  
		const{username, nickname,password,posts}=await userData.getUserById(userId);// should determine posts
    	res.render('users/useraccount',{username: username, nickname: nickname, password: password, 'post-list':posts});
	}catch(e){
		res.status(404).json({ error: 'User not found' });
	}
	
});

router.get('/signin', async (req, res) => {
	if (req.session.user) {		//if logged in, redirect to the homepage
		return res.redirect('/homePage');
	}
    res.render('home/signin');
});

router.post('/signin', async (req, res) => {
	if (req.session.user) {		//if logged in, redirect to the homepage
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
				req.session.user = {userId: x._id.toHexString()}; 
                return res.redirect('/users/account');
			}
            break;
        }
    }
    res.status(401).render('home/signin',{message:"Invalid account or password"});
});

router.get('/signup', async (req, res) => {
    if (req.session.user) {		//if logged in, redirect to the homepage
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
		req.session.user = {userId: newUser._id.toHexString()}; 
        return res.redirect('/homePage');
	}catch(e)
	{
		res.status(404).render('home/signup',{message:e});
	}
});

router.get('/signout', async (req, res) => {
	if (!req.session.user) {		//if not logged in, redirect to the homepage
		return res.redirect('/homePage');
	}
	req.session.destroy();
    return res.redirect('/homePage');
});

router.post('/account', async (req, res) => { //patch _ edit username,nickname,password
	let { username, password,nickname } = req.body;
	const {userId} = req.session.user; 
	let oldUser;
	try {
		oldUser = await userData.getUserById(userId);
	} catch (e) {
		res.status(404).json({ error: 'User not found' });
		return;
	}
	try {
		if (username == oldUser.username) throw "You have to submit different username"; 
		if (password == oldUser.password) throw "You have to submit different password";
		if (nickname == oldUser.nickname) throw "You have to submit different nickname";
		if(username)
		{
			await userData.editUsername(userId, username );
		}else if(password)
		{
			const hash = await bcrypt.hash(password, saltRounds);
			await userData.editPassword(userId, hash );
		}else if(nickname)
		{
			await userData.editNickname(userId, nickname );
		}
		res.redirect('/users/account');
	} catch (e) { 
		const oldUsername = oldUser.username;
		const oldNickname = oldUser.nickname;
		const oldPassword = oldUser.password;
		const oldPosts = oldUser.posts;
		res.status(404).render('users/useraccount',{username: oldUsername, nickname: oldNickname, password: oldPassword, 'post-list':oldPosts, message:e});
	}
});

//create getAll route 
router.get("/", async (req, res) => {
	try {
      const userList = await userData.getAllUsers();
      res.json(userList);
    } catch (e) {
      res.status(500).send();
    }
});

module.exports = router;