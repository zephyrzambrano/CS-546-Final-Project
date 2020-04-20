const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;

/*
/get (get user information)
/post (create user)
/patch (edit user)
*/


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

router.patch('/:id', async (req, res) => {
	const requestBody = req.body;
	let updatedObject = {};
	try {
		const oldUser = await userData.getUserById(req.params.id);// revised oldPost to oldUser
		if (requestBody.username && requestBody.username !== oldUser.username) updatedObject.username = requestBody.username; 
		if (requestBody.password && requestBody.password !== oldUser.password) updatedObject.password = requestBody.password;
		if (requestBody.nickname && requestBody.nickname !== oldUser.nickname) updatedObject.nickname = requestBody.nickname;
		if (requestBody.userId && requestBody.userId !== oldUser.userId)
			updatedObject.userId = requestBody.userId;
	} catch (e) {
		res.status(404).json({ error: 'User not found' });
		return;
	}

	try {
		const updatedUser = await userData.editUser(req.params.id, updatedObject.username,updatedObject.password,updatedObject.nickname);//updated input parameters
		res.json(updatedUser);
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