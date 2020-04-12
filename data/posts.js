const mongoCollections = require('../config/mongoCollections');
const posts = mongoCollections.posts;
const { ObjectId } = require('mongodb');

/*
There are 11 properties in the post collection
1.PostId:ObjectID
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
    if (!topic || typeof topic !== "string")//此函数需要互动user collection，当创建了一个post，user的postID需要添加一条数据
        throw 'you should input a string as the topic';
    if (!userId || typeof userId !== "string")
        throw 'you should input a string as the userId';
    if (!content || typeof content !== "string")
        throw 'you should input a string as the content';
    if (!photoArr || !Array.isArray(tagArr))
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
        date: new Date()
    }
    let insertInfo = await postCollection.insertOne(newPost);
    if (insertInfo.insertedCount === 0)
        throw 'Could not create the Post';
    let newId = insertInfo.insertedId;
    let postCreated = await this.getPostById(newId.toHexString());

    usersCollection.addPostToUser(userId,newId.toHexString());//call the method in the user collection

    return postCreated;
}

async function getPostById(id) {
    if (!id || typeof id !== "string")
        throw 'You must provide an id to search for';
    let postCollection = await posts();
    let objId = ObjectId.createFromHexString(id);
    let PostGoal = await postCollection.findOne({ _id: objId });
    if (PostGoal === null) throw 'No Post with that id';
    return PostGoal;
}

async function getPostByString(str) {
    if (!str || typeof str !== "string") throw 'You must provide an str to search for';
    let postCollection = await posts();
    let re = new RegExp(".*" + str + ".*", "i");
    let PostGoal = await postCollection.find({ topic: re }).toArray();
    // let PostGoal = await postCollection.find({content:/01/i}).toArray();
    if (PostGoal === null) throw 'No Post with that id';
    return PostGoal;
}

async function getPostByOneTag(tag) {
    if (!tag || typeof tag !== "string") throw 'You must provide a tag to search for';
    let postCollection = await posts();
    let PostGoal = await postCollection.find({ tagArr: { $elemMatch: { $eq: tag } } }).toArray();
    if (PostGoal === null) throw 'No Post with that id';
    return PostGoal;
}

async function getPostByMultTag(tags) {
    if (!tags || !Array.isArray(tags))
        throw "You must provide an array of tags"
    let postCollection = await posts();
    let PostGoal = await postCollection.find({ tagArr: { $all: tags } }).toArray();
    if (PostGoal === null) throw 'No Post with that id';
    return PostGoal;
}

async function editContent(id, newContent) {
    if (!id || typeof id !== "string") throw 'You must provide an id to search for';
    if (!newContent || typeof newContent !== "string") throw 'You must provide the new content to update';
    let objId = ObjectId.createFromHexString(id);
    let postCollection = await posts();
    let updatedInfo = await postCollection.updateOne({ _id: objId }, { $set: { content: newContent } });
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update the post successfully';
    }
    return await this.getPostById(id);
}

async function addLikeCount(postId, userId) {
    if (!postId || typeof postId !== "string") throw 'You must provide a post id';
    if (!userId || typeof userId !== "string") throw 'You must provide an user id';
    let postObjId = ObjectId.createFromHexString(postId);
    let postGoal = await this.getPostById(postId);
    if (postGoal.likeCount.indexOf(userId) !== -1)
        throw "the user has already liked it";
    if (postGoal.dislikeCount.indexOf(userId) !== -1)
        throw "the user has already disliked it";
    postGoal.likeCount.push(userId);
    let postCollection = await posts();
    let updatedInfo = await postCollection.updateOne({ _id: postObjId }, { $set: { likeCount: postGoal.likeCount } });
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update the like successfully';
    }
    return await this.getPostById(postId);
}

async function addDislikeCount(postId, userId) {
    if (!postId || typeof postId !== "string") throw 'You must provide a post id';
    if (!userId || typeof userId !== "string") throw 'You must provide an user id';
    let postObjId = ObjectId.createFromHexString(postId);
    let postGoal = await this.getPostById(postId);
    if (postGoal.dislikeCount.indexOf(userId) !== -1)
        throw "the user has already disliked it";
    if (postGoal.likeCount.indexOf(userId) !== -1)
        throw "the user has already liked it";
    postGoal.dislikeCount.push(userId);
    let postCollection = await posts();
    let updatedInfo = await postCollection.updateOne({ _id: postObjId }, { $set: { dislikeCount: postGoal.dislikeCount } });
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update the like successfully';
    }
    return await this.getPostById(postId);
}

async function addViewCount(postId) {
    if (!postId || typeof postId !== "string") throw 'You must provide a post id';
    let postObjId = ObjectId.createFromHexString(postId);
    let postGoal = await this.getPostById(postId);
    let postCollection = await posts();
    let updatedInfo = await postCollection.updateOne({ _id: postObjId }, { $set: { viewCount: postGoal.viewCount + 1 } });
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update the like successfully';
    }
    return await this.getPostById(postId);
}

async function removePost(postId) {
    if (!postId || typeof postId !== "string") throw 'You must provide a post id';
    let postObjId = ObjectId.createFromHexString(postId);
    let postCollection = await posts();
    let postInfo=await this.getPostById(postId);
    let deletionInfo = await postCollection.removeOne({ _id: postObjId });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete the band with id of ${id}`;
    }

    usersCollection.removePostId(postInfo.userId,postId);//call the method in the user collection

    return true;
}

async function addCommentIdToPost(postId, commentId) {//此函数需要配合comment collection使用，当一条comment数据被创建，应调用此函数
    if (!postId || typeof postId !== "string") throw 'You must provide a post id';
    if (!commentId || typeof commentId !== "string") throw 'You must provide a comment id';
    let postObjId = ObjectId.createFromHexString(postId);
    let postCollection = await posts();
    let postGoal = await this.getPostById(postId);
    postGoal.commentIdArr.push(commentId);
    let updatedInfo = await postCollection.updateOne({ _id: postObjId }, { commentIdArr: postGoal.commentIdArr });
    console.log(updatedInfo);
    return true;
}

async function removeCommentIdFromPost(postId, commentId) {//此函数需要配合comment collection使用，当一条comment数据被删除，应调用此函数
    if (!postId || typeof postId !== "string") throw 'You must provide a post id';
    if (!commentId || typeof commentId !== "string") throw 'You must provide a comment id';
    let postObjId = ObjectId.createFromHexString(postId);
    let postCollection = await posts();
    let postGoal = await this.getPostById(postId);
    let temp=[];
    for(let i=0;i<postGoal.commentIdArr.length;i++){
        if(postGoal.commentIdArr[i]!==commentId)
            temp.push(postGoal.commentIdArr[i]);
    }
    postGoal.commentIdArr=temp;
    let updatedInfo = await postCollection.updateOne({ _id: postObjId }, { commentIdArr: postGoal.commentIdArr });
    console.log(updatedInfo);
    return true;
}

module.exports = {
    createPost,
    getPostById,
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






