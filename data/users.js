const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
// add more mongoCollections if needed

/* Uncomment require statements these if needed

const posts = require('./posts');
const comments = require('./comments');
const reports = require('./reports');
*/

/*
userid - objectid
username - string
password - string
nickname - string
postid - array of post ids
*/


async function createUser(username, password, nickname) {

    if (!username || typeof username !== "string") throw "must provide username";
    if (!password || typeof username !== "string") throw "must provide password";
    if (!nickname || typeof username !== "string") throw "must provide nickname";

    const userCollection = await users();

    let newUser = {
        username: username,
        password: password,
        nickname: nickname, 
        posts: [],
        comments: []
    };

    const newInsertInformation = await userCollection.insertOne(newUser);
	if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
	return await this.getUserById(newInsertInformation.insertedId);
};

async function getUserById(userId) {
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw 'User not found';
    return user;
};

async function getAllUsers() {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    return userList;
};

async function editUser(userId, username, password, nickname) {
    const user = await this.getUserById(userId);
		console.log(user);

		const userUpdateInfo = {
			username: username,
            password: password,
            nickname: nickname
		};

		const userCollection = await users();
		const updateInfo = await userCollection.updateOne({ _id: userId }, { $set: userUpdateInfo });
		if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

		return await this.getUserById(id);
};

module.exports = {
    createUser,
    getUserById,
    getAllUsers,
    editUser
}
