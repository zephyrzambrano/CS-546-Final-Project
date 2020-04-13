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
		const newUser = await userData.addUser(userInfo.username, userinfo.password, userinfo.nickname);
		res.json(newUser);
	} catch (e) {
		res.sendStatus(500);
	}
});

router.patch('/:id', async (req, res) => {
	const requestBody = req.body;
	let updatedObject = {};
	try {
		const oldUser = await userData.getUserById(req.params.id);
		if (requestBody.username && requestBody.username !== oldPost.username) updatedObject.username = requestBody.username;
		if (requestBody.password && requestBody.password !== oldPost.password) updatedObject.password = requestBody.password;
		if (requestBody.nickname && requestBody.nickname !== oldPost.nickname) updatedObject.nickname = requestBody.nickname;
		if (requestBody.userId && requestBody.userId !== oldUser.userId)
			updatedObject.userId = requestBody.userId;
	} catch (e) {
		res.status(404).json({ error: 'User not found' });
		return;
	}

	try {
		const updatedUser = await userData.editUser(req.params.id, updatedObject);
		res.json(updatedUser);
	} catch (e) {
		res.status(500).json({ error: e });
	}
});


module.exports = router;