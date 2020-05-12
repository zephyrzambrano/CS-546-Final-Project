const mongoCollections = require('../config/mongoCollections');
const { ObjectId } = require('mongodb');
const posts = mongoCollections.posts;
const comments = mongoCollections.comments;
const usersCollection = require("./users.js");



/*
There are 11 properties in the post collection
1._id(PostId):ObjectID
2.topic:string
3.userId:string
4.content:string
5.photoArr:arr[string of photo adress]
6.commentIdArr:arr[string of commentId]
7.tagArr:array[string of tags]
8.likeCount[string of userId]
9.dislikeCount[string of userId]
10.viewCount:number
11.date:Date object
*/


async function createPost(topic, userId, content, photoArr, tagArr) {//This function needs to interact with the user collection, and when a post is created, the user's postID needs to add a piece of data
    if (!topic || typeof topic !== "string")
        throw 'you should input a string as the topic';
    if (!userId || typeof userId !== "string")
        throw 'you should input a string as the userId';
    if (!content || typeof content !== "string")
        throw 'you should input a string as the content';
    if (!photoArr || !Array.isArray(photoArr))
        throw "You must provide an array of photos"
    if (!tagArr || !Array.isArray(tagArr))
        throw "You must provide an array of tags"
    let postCollection = await posts();
    let newPost = {
        topic: topic,
        userId: userId,
        content: content,
        photoArr: photoArr,
        commentIdArr: [],
        tagArr: tagArr,
        likeCount: [],
        dislikeCount: [],
        viewCount: 0,
        date: new Date().toLocaleDateString()
    }
    let insertInfo = await postCollection.insertOne(newPost);
    if (insertInfo.insertedCount === 0)
        throw 'Something wrong when creating the post';
    let newId = insertInfo.insertedId;
    let postCreated = await getPostById(newId.toHexString());

    await usersCollection.addPostToUser(userId, newId.toHexString());//call the method in the user collection

    return postCreated;
}

async function getAllPost() {
    let postCollection = await posts();
    let postsGoal = await postCollection.find({}).toArray();;
    return postsGoal;
}

async function getPostById(id) {
    if (!id || typeof id !== "string")
        throw 'You must provide an id to search for';
    let postCollection = await posts();
    let objId = ObjectId.createFromHexString(id);
    let postGoal = await postCollection.findOne({ _id: objId });
    if (postGoal === null)
        throw 'No Post with that id';
    return postGoal;
}

async function getPostByString(str) {
    if (!str || typeof str !== "string") throw 'You must provide an str to search for';
    let postCollection = await posts();
    let re = new RegExp(".*" + str + ".*", "i");
    // let PostGoal = await postCollection.find({ topic: re }).toArray();
    let PostGoal = await postCollection.find({ $or: [{ topic: re }, { content: re }] }).toArray();
    // if (PostGoal === null) throw 'No Post with that string';
    return PostGoal;
}

async function getPostByOneTag(tag) {
    if (!tag || typeof tag !== "string") throw 'You must provide a tag to search for';
    let postCollection = await posts();
    let PostGoal = await postCollection.find({ tagArr: { $elemMatch: { $eq: tag } } }).toArray();
    // if (PostGoal === null) throw 'No Post with that tag';
    return PostGoal;
}

async function getPostByMultTag(tags) {
    if (!tags || !Array.isArray(tags))
        throw "You must provide an array of tags"
    let postCollection = await posts();
    let PostGoal = await postCollection.find({ tagArr: { $all: tags } }).toArray();
    // if (PostGoal === null) throw 'No Post with that tags';
    return PostGoal;
}

async function editContent(id, newContent) {
    if (!id || typeof id !== "string") throw 'You must provide an id to search for';
    if (!newContent || typeof newContent !== "string") throw 'You must provide the new content to update';
    let objId = ObjectId.createFromHexString(id);
    let postCollection = await posts();
    let updatedInfo = await postCollection.updateOne({ _id: objId }, { $set: { content: newContent } });
    return await getPostById(id);
}

async function addLikeCount(postId, userId) {
    if (!postId || typeof postId !== "string") throw 'You must provide a post id';
    if (!userId || typeof userId !== "string") throw 'You must provide an user id';
    let postObjId = ObjectId.createFromHexString(postId);
    let postGoal = await getPostById(postId);
    if (postGoal.dislikeCount.indexOf(userId) !== -1)
        throw "the user has already disliked it";
    if (postGoal.likeCount.indexOf(userId) !== -1) {
        let index = postGoal.likeCount.indexOf(userId);
        postGoal.likeCount.splice(index, 1);
        let postCollection = await posts();
        let updatedInfo = await postCollection.updateOne({ _id: postObjId }, { $set: { likeCount: postGoal.likeCount } });
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not cancel the likeCount successfully';
        }
        return await getPostById(postId);
    }
    else {
        postGoal.likeCount.push(userId);
        let postCollection = await posts();
        let updatedInfo = await postCollection.updateOne({ _id: postObjId }, { $set: { likeCount: postGoal.likeCount } });
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not add the likeCount successfully';
        }
        return await getPostById(postId);
    }
}

async function addDislikeCount(postId, userId) {
    if (!postId || typeof postId !== "string") throw 'You must provide a post id';
    if (!userId || typeof userId !== "string") throw 'You must provide an user id';
    let postObjId = ObjectId.createFromHexString(postId);
    let postGoal = await getPostById(postId);
    if (postGoal.likeCount.indexOf(userId) !== -1)
        throw "the user has already liked it";
    if (postGoal.dislikeCount.indexOf(userId) !== -1) {
        let index = postGoal.dislikeCount.indexOf(userId);
        postGoal.dislikeCount.splice(index, 1);
        let postCollection = await posts();
        let updatedInfo = await postCollection.updateOne({ _id: postObjId }, { $set: { dislikeCount: postGoal.dislikeCount } });
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not cancel the dislikeCount successfully';
        }
        return await getPostById(postId);
    }
    else {
        postGoal.dislikeCount.push(userId);
        let postCollection = await posts();
        let updatedInfo = await postCollection.updateOne({ _id: postObjId }, { $set: { dislikeCount: postGoal.dislikeCount } });
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not add the dislike successfully';
        }
        return await getPostById(postId);
    }
}

async function addViewCount(postId) {
    if (!postId || typeof postId !== "string") throw 'You must provide a post id';
    let postObjId = ObjectId.createFromHexString(postId);
    let postGoal = await getPostById(postId);
    let postCollection = await posts();
    let updatedInfo = await postCollection.updateOne({ _id: postObjId }, { $set: { viewCount: postGoal.viewCount + 1 } });
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not add the viewCount successfully';
    }
    return await getPostById(postId);
}

async function removePost(postId) {
    if (!postId || typeof postId !== "string") throw 'You must provide a post id';

    await removeAllCommentsInPost(postId);//delete the data in the comment collection

    let postObjId = ObjectId.createFromHexString(postId);
    let postCollection = await posts();
    let postInfo = await getPostById(postId);
    let deletionInfo = await postCollection.removeOne({ _id: postObjId });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete the band with id of ${id}`;
    }

    await usersCollection.removePostFromUser(postInfo.userId, postId);//call the method in the user collection to remove the post id

    return true;
}

async function addCommentIdToPost(postId, commentId) {
    if (!postId || typeof postId !== "string") throw 'You must provide a post id';
    if (!commentId || typeof commentId !== "string") throw 'You must provide a comment id';
    let postObjId = ObjectId.createFromHexString(postId);
    let postCollection = await posts();
    let postGoal = await getPostById(postId);
    postGoal.commentIdArr.push(commentId);
    let updatedInfo = await postCollection.updateOne({ _id: postObjId }, { $set: { commentIdArr: postGoal.commentIdArr } });
    // console.log(updatedInfo);
    return true;
}

async function removeCommentIdFromPost(postId, commentId) {
    if (!postId || typeof postId !== "string") throw 'You must provide a post id';
    if (!commentId || typeof commentId !== "string") throw 'You must provide a comment id';
    let postObjId = ObjectId.createFromHexString(postId);
    let postCollection = await posts();
    let postGoal = await getPostById(postId);
    let temp = [];
    for (let i = 0; i < postGoal.commentIdArr.length; i++) {
        if (postGoal.commentIdArr[i] !== commentId)
            temp.push(postGoal.commentIdArr[i]);
    }
    postGoal.commentIdArr = temp;
    let updatedInfo = await postCollection.updateOne({ _id: postObjId }, { $set: { commentIdArr: postGoal.commentIdArr } });
    // console.log(updatedInfo);
    return true;
}

async function removeAllCommentsInPost(postId) {//the method will delete all the comments in comments collection which has this postId
    if (!postId || typeof postId !== "string")
        throw 'you should input a string as the postId';

    let commentCollection = await comments();
    let deletionInfo = await commentCollection.remove({ postId: postId });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete the comment`;
    }
    return true;
}

module.exports = {
    createPost,
    getPostById,
    getAllPost,
    getPostByMultTag,
    getPostByOneTag,
    getPostByString,
    editContent,
    addLikeCount,
    addDislikeCount,
    addViewCount,
    removePost,
    addCommentIdToPost,
    removeCommentIdFromPost
}




