const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
ObjectId = require('mongodb').ObjectID;


async function createUser(username, password, nickname) {

    if (!username || typeof username !== "string") throw "must provide username";
    if (!password || typeof username !== "string") throw "must provide password";
    if (!nickname || typeof username !== "string") throw "must provide nickname";

    const userCollection = await users();

    let newUser = {
        // userid - object id created by mongodb
        username: username, // string
        password: password, // string
        nickname: nickname,  // string
        posts: [], // array of postIds as strings
        comments: [] // array of commentIds as strings
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

async function addPostToUser(userId, postId) { // postId is passed through and stored as a string
    let currentUser = await this.getUserById(userId);
    console.log(currentUser);

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        {_id: ObjectId(userId)},
        {$addToSet: {posts: postId} }
        // {$addToSet: {posts: ObjectId(postId).toString()} }
    );

    if (!updateInfo.matchedCount && ! updateInfo.modifiedCount) throw 'Update failed';

    return await this.getUserById(userId);
};

async function removePostFromUser(userId, postId) { // postId is passed through and stored as a string
    let currentUser = await this.getUserById(userId);
    console.log(currentUser);

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        {_id: ObjectId(userId)},
        {$pull: {posts: postId} }
        // {$pull: {posts: ObjectId(postId).toString()} }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

    return await this.getUserById(userId);
};

async function addCommentToUser(userId, commentId) { // commentId is passed through and stored as a string
    let currentUser = await this.getUserById(userId);
    console.log(currentUser);

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        {_id: ObjectId(userId)},
        {$addToSet: {comments: commentId} }
        // {$addToSet: {comments: ObjectId(commentId).toString()} }
    );

    if (!updateInfo.matchedCount && ! updateInfo.modifiedCount) throw 'Update failed';

    return await this.getUserById(userId);

};

async function removeCommentFromUser(userId, commentId) { // commentId is passed through and stored as a string
    let currentUser = await this.getUserById(userId);
    console.log(currentUser);

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        {_id: ObjectId(userId)},
        {$pull: {comments: commentId} }
        // {$pull: {comments: ObjectId(commentId).toString()} }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

    return await this.getUserById(userId);
};


module.exports = {
    createUser,
    getUserById,
    getAllUsers,
    editUser,
    addPostToUser,
    removePostFromUser,
    addCommentToUser,
    removeCommentFromUser
}
