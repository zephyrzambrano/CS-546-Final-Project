var uuid = require("node-uuid");
const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const user = require("./users");
const post = require("./posts");
// const users = mongoCollections.users;
// const posts = mongoCollections.posts;

async function getComment(id) {
    try {
      if (!id) throw 'You must provide an id to search for.';
      if(typeof id !== 'string') throw 'id must be string type.';

      const commentCollection = await comments();
      const commentResult = await commentCollection.findOne({ _id:id });
      if (commentResult === null) throw `No commentInfo is compatible with this ${id}`;

      return commentResult;
    } catch (error) {
      console.log(error);
    }
  }

async function getAll() {
    try {
      const commentCollection = await comments();

      const allComments = await commentCollection.find({}).toArray();

      return allComments;
    } catch (error) {
      console.log(error);
    }
  }

async function addComment(title, post, user, content) {
    try {
      if (!title || typeof title !== 'string') throw 'You must provide a title(String).';
      if (!post) throw 'You must provide a post which is _id(String).';
      if (!user) throw 'You must provide a user which is _id(String).';
      if (!content || typeof title !== 'string') throw 'You must provide content(String).';

      var D = new Date();   
		  var year = D.getFullYear();   
		  var month = D.getMonth()+1;   
		  var date = D.getDate();  
		  // var day = D.getDay();  
		  var hour = D.getHours(); 
      var minutes = D.getMinutes(); 
      
      let time = `${hour}:${minutes} ${month}/${date}/${year}`;

      // let postCollection = await posts();
      let commentCollection = await comments();

      let newComment = {
        title: title,
        content: content,
        time: time,
        post: post,
        user: user,
        _id: uuid.v1()
      };

      const insertInfo = await commentCollection.insertOne(newComment);
      if (insertInfo.insertedCount === 0) throw 'Could not add this comment';

      const newId = insertInfo.insertedId;

      let comment = await this.getComment(newId);
      // console.log(author, typeof author)

      let thisPost = await post.getPost(post); // get certain post through 'post' which is _id
      let thisUser = await user.getUser(user);

      thisPost.comments.push(newId); // add post _id into posts.comments[]
      thisUser.comments.push(newId); // add user _id into bands.comments[]

      let updatedPost = {
        comments: thisPost.comments
      };
      let updatedUser = {
        comments: thisUser.comments
      }

      const postUpdatedInfo = await postCollection.updateOne({_id: post}, {$set: updatedPost});
      if (postUpdatedInfo.modifiedCount === 0) {
        throw 'could not update comments in "posts" successfully';
      }

      const userUpdatedInfo = await userCollection.updateOne({_id: user}, {$set: updatedUser});
      if (userUpdatedInfo.modifiedCount === 0) {
        throw 'could not update comments in "users" successfully';
      }

      return comment;
  } catch (error) {
    console.log(error)
  }
}

async function remove(id) {
  try {
    if (!id || typeof id !== 'string') throw 'You must provide an id(String) to search for';

    const commentCollection = await comments();

    const theComment = await this.getComment(id)

    const deleteInfo = await commentCollection.removeOne({ _id:id });
    if (deleteInfo.deletedCount === 0) {
      throw `Could not delete comment with id of ${id}`;
    }

    let postCollection = await posts();
    let thePost = await post.getPost(theComment.post);

    let userCollection = await users();
    let theUser = await post.getUser(theComment.user);

    if(thePost.comments.length === 0){
      throw 'this comment is not added to any band, so DELETE is successful but no band is changed.'
    }
    for(let i = 0; i<thePost.comments.length; i++){

      if(thePost.comments[i] === id){
        thePost.comments.splice(i,1);

        const deletedCommentInPost = {
          comments: thePost.comments
        }

        const updatedInfo = await postCollection.updateOne({_id: theComment.post}, {$set: deletedCommentInPost});
        if (updatedInfo.modifiedCount === 0) {
          throw 'could not delete comment in "posts" successfully';
        }
        break;
      }
    }

    for(let i = 0; i<theUser.comments.length; i++){

      if(theUser.comments[i] === id){
        theUser.comments.splice(i,1);

        const deletedCommentInUser = {
          comments: theUser.comments
        }

        const updatedInfo = await userCollection.updateOne({_id: theComment.user}, {$set: deletedCommentInUser});
        if (updatedInfo.modifiedCount === 0) {
          throw 'could not delete comment in "users" successfully';
        }
      }
    }

    return 'Comment Deleted Successfully!';
  } catch (error) {
    console.log(error);
  }
}

  // async function getFullComment(commentId) {
  //     try {
  //       if (!commentId) throw 'You must provide an id to search for.';
  
  //       let commentCollection = await comments();
  //       let commentResult = await commentCollection.findOne({ _id: commentId });
  //       if (commentResult === null) throw `No commentInfo is compatible with this ${commentId}`;

  //       const thePost = await band.getPost(commentResult.author);

  //       commentResult.author = thePost.bandName;
  
  //       return commentResult;
  //     } catch (error) {
  //       console.log(error)
  //     }
  // }

module.exports = {
  getComment,
  getAll,
  addComment,
  remove,
  // getFullComment
}