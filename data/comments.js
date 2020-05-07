const mongoCollections = require('../config/mongoCollections');
const { ObjectId } = require('mongodb');
const comments = mongoCollections.comments;
const postsCollection = require("./posts.js");

async function getCommentById(id) {
    if (!id || typeof id !== "string")
        throw 'You must provide an id to search for';
    let commentCollection = await comments();
    let objId = ObjectId.createFromHexString(id);
    let commentGoal = await commentCollection.findOne({ _id: objId });
    if (commentGoal === null)
        throw 'No comment with that id';
    return commentGoal;
}

async function getAllComments() {
    let commentCollection = await comments();
    let allComments = await commentCollection.find({}).toArray();
    return allComments;
}

async function addComment(postId, userId, content) {

    if (!postId || typeof postId !== "string")
        throw 'you should input a string as the postId';
    if (!userId || typeof userId !== "string")
        throw 'you should input a string as the userId';
    if (!content || typeof content !== "string")
        throw 'you should input a string as the content';

    let commentCollection = await comments();
    let newComment = {
        postId: postId,
        userId: userId,
        content: content,
        date: new Date().toLocaleDateString()
    }
    let insertInfo = await commentCollection.insertOne(newComment);
    if (insertInfo === null)
        throw 'Something wrong when adding the comment';
    let newCommentId = insertInfo.insertedId;
    let commentCreated = await getCommentById(newCommentId.toHexString());

    await postsCollection.addCommentIdToPost(postId, newCommentId.toHexString());

    return commentCreated;
}

async function removeComment(postId, commentId) {
    if (!postId || typeof postId !== "string")
        throw 'you should input a string as the postId';
    if (!commentId || typeof commentId !== "string")
        throw 'you should input a string as the commentId';

    await postsCollection.removeCommentIdFromPost(postId, commentId);

    let commentObjId = ObjectId.createFromHexString(commentId);
    let commentCollection = await comments();
    let deletionInfo = await commentCollection.removeOne({ _id: commentObjId });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete the comment`;
    }
    // userCollection.removeCommentFromUser(userId,commentId);
    return true;
}


module.exports={
    getCommentById,
    addComment,
    removeComment,
    getAllComments
}

