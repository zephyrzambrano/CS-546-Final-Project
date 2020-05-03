const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;

/*
/get (get user information)
/post (create user)
/post/id (edit user)
*/
router.get('/account', async (req, res) => {
    // if (!req.session.user) {		//if not logged in, redirect to the homepage
	// 	return res.redirect('/');
	// }

	// const {userId} = req.session.user;    //will retrieve the userId from session
	const userId= "5ea8b8829e985f05f07d933c";
	const{username, nickname,password,posts}=await userData.getUserById(userId);// should determine posts
    res.render('users/useraccount',{username: username, nickname: nickname, password: password, 'post-list':posts});
});

router.get('/signin', async (req, res) => {
    // if (!req.session.user) {		//if not logged in, redirect to the homepage
	// 	return res.redirect('/');
	// }

	// const {userId} = req.session.user;    //will retrieve the userId from session
    res.render('home/signin');
});

router.get('/signup', async (req, res) => {
    // if (!req.session.user) {		//if not logged in, redirect to the homepage
	// 	return res.redirect('/');
	// }

	// const {userId} = req.session.user;    //will retrieve the userId from session
	res.render('home/signup');
});


router.get('/:id', async (req, res) => {
	try {
		let user = await userData.getUserById(req.params.id);
		res.json(user);
	} catch (e) {
		res.status(404).json({ error: 'User not found' });
	}
});

router.post('/', async (req, res) => {
	let userInfo = req.body;
	if (!userInfo) {
		res.status(400).json({ error: 'You must provide data to create a user' });
		return;
	}

	if (!userInfo.username) {
		res.status(400).json({ error: 'You must provide a username' });
		return;
	}

	if (!userInfo.password) {
		res.status(400).json({ error: 'You must provide a password' });
		return;
	}
	if (!userInfo.nickname) {
		res.status(400).json({ error: 'You must provide a nickname' });
		return;
	}

	try {
		const newUser = await userData.createUser(userInfo.username,userInfo.password,userInfo.nickname);//revised userinfo to userInfo, and wrong function name
		res.json(newUser);
	} catch (e) {
		res.status(400).json({ error: e });
	}
});

router.post('/:id', async (req, res) => { //patch _ edit username,nickname,password
	const { username, password,nickname } = req.body;
	let updatedObject={};
	try {
		const oldUser = await userData.getUserById(req.params.id);
		
		if (username && username !== oldUser.username) updatedObject.username = username; 
		if (password && password !== oldUser.password) updatedObject.password = password;
		if (nickname && nickname !== oldUser.nickname) updatedObject.nickname = nickname;
	} catch (e) {
		res.status(404).json({ error: 'User not found' });
		return;
	}
	try {
		let updatedUser;
		if(updatedObject.username)
		{
			updatedUser = await userData.editUsername(req.params.id, username );
		}else if(updatedObject.password)
		{
			updatedUser = await userData.editPassword(req.params.id, password );
		}else if(updatedObject.nickname)
		{
			updatedUser = await userData.editNickname(req.params.id, nickname );
		}
		res.redirect('/users/account');
	} catch (e) {
		res.status(500).json({ error: e });
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