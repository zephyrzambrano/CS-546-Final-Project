const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
ObjectId = require('mongodb').ObjectID;


async function createUser(username, password, nickname) { //tested
    if (!username || typeof username !== "string") throw "must provide username";
    if (!password || typeof username !== "string") throw "must provide password";
    if (!nickname || typeof username !== "string") throw "must provide nickname";
    const userCollection = await users();

    let usernameExist = await userCollection.findOne({ username: username });
    if (usernameExist !== null)
        throw "the username is already exist"
    let nicknameExist = await userCollection.findOne({ nickname: nickname });
    if (nicknameExist !== null)
        throw "the nickname is already exist"

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

async function getUserById(userId) { //updated string id to objid, tested
    const userCollection = await users();
    if (typeof userId == "string") {
        const objId = ObjectId.createFromHexString(userId);
        userId = objId;
    }
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw 'User not found';
    return user;
};

async function getAllUsers() {//tested
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    return userList;
};

async function editPassword(userId, password) {
    if (!userId || typeof userId !== "string")
        throw 'you should input a string as the userId';
    if (!password || typeof password !== "string")
        throw 'you should input a string as the password';

    let userObjId = ObjectId.createFromHexString(userId);
    let userCollection = await users();

    let userUpdateInfo = {
        password: password
    };
    let updatedInfo = await userCollection.updateOne({ _id: userObjId }, { $set: userUpdateInfo });
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not edit the password successfully';
    }
    return this.getUserById(userId);
};

async function editUsername(userId, username) {//the username is unique and modifiable
    if (!userId || typeof userId !== "string")
        throw 'you should input a string as the userId';
    if (!username || typeof username !== "string")
        throw 'you should input a string as the username';

    let userObjId = ObjectId.createFromHexString(userId);
    let userCollection = await users();
    let usernameExist = await userCollection.findOne({ username: username });
    if (usernameExist)
        throw "the username is already exisited"
    else {
        let userUpdateInfo = {
            username: username
        };
        let updatedInfo = await userCollection.updateOne({ _id: userObjId }, { $set: userUpdateInfo });
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not edit the username successfully';
        }
        return this.getUserById(userId);
    }
};

async function editNickname(userId, nickname) {//the name is unique and modifiable
    if (!userId || typeof userId !== "string")
        throw 'you should input a string as the userId';
    if (!nickname || typeof nickname !== "string")
        throw 'you should input a string as the nickname';

    let userObjId = ObjectId.createFromHexString(userId);
    let userCollection = await users();
    let nicknameExist = await userCollection.findOne({ nickname: nickname });
    if (nicknameExist)
        throw "the nickname is already exisited"
    else {
        let userUpdateInfo = {
            nickname: nickname
        };
        let updatedInfo = await userCollection.updateOne({ _id: userObjId }, { $set: userUpdateInfo });
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not edit the nickname successfully';
        }
        return this.getUserById(userId);
    }
};

async function addPostToUser(userId, postId) { // postId is passed through and stored as a string
    let currentUser = await this.getUserById(userId);
    // console.log(currentUser);

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        { _id: ObjectId(userId) },
        { $addToSet: { posts: postId } }
        // {$addToSet: {posts: ObjectId(postId).toString()} }
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

    return await this.getUserById(userId);
};

async function removePostFromUser(userId, postId) { // postId is passed through and stored as a string
    let currentUser = await this.getUserById(userId);
    // console.log(currentUser);

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        { _id: ObjectId(userId) },
        { $pull: { posts: postId } }
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
        { _id: ObjectId(userId) },
        { $addToSet: { comments: commentId } }
        // {$addToSet: {comments: ObjectId(commentId).toString()} }
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

    return await this.getUserById(userId);

};

async function removeCommentFromUser(userId, commentId) { // commentId is passed through and stored as a string
    let currentUser = await this.getUserById(userId);
    console.log(currentUser);

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        { _id: ObjectId(userId) },
        { $pull: { comments: commentId } }
        // {$pull: {comments: ObjectId(commentId).toString()} }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

    return await this.getUserById(userId);
};


module.exports = {
    createUser,
    getUserById,
    getAllUsers,
    editUsername,
    editPassword,
    editNickname,
    addPostToUser,
    removePostFromUser
    // addCommentToUser,
    // removeCommentFromUser
}
