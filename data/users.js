const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
ObjectId = require('mongodb').ObjectID;


async function createUser(username, password, nickname) { 
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
        username: username, 
        password: password, 
        nickname: nickname,  
        posts: [], 
        comments: [], 
        Admin: false
    };
    const newInsertInformation = await userCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
    return await this.getUserById(newInsertInformation.insertedId);
};

async function getUserById(userId) { 
    const userCollection = await users();
    if (typeof userId == "string") {
        const objId = ObjectId.createFromHexString(userId);
        userId = objId;
    }
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw 'User not found';
    return user;
};

async function getAllUsers() {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    return userList;
};

async function setAdminAccess(userId) {
    if (!userId || typeof userId !== "string")
        throw 'you should input a string as the userId';
    let userObjId = ObjectId.createFromHexString(userId);
    let userCollection = await users();
    let userUpdateInfo = {
        Admin:true
    };
    let updatedInfo = await userCollection.updateOne({ _id: userObjId }, { $set: userUpdateInfo });
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not set Admin access successfully';
    }
    return this.getUserById(userId);
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

async function editUsername(userId, username) {
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

async function editNickname(userId, nickname) {
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

async function addPostToUser(userId, postId) { 
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        { _id: ObjectId(userId) },
        { $addToSet: { posts: postId } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
    return await this.getUserById(userId);
};

async function removePostFromUser(userId, postId) { 
    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        { _id: ObjectId(userId) },
        { $pull: { posts: postId } }
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
    removePostFromUser,
    setAdminAccess
}
