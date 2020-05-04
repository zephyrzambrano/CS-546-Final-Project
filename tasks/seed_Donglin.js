const users = require('../data/users.js');
const comments = require('../data/comments.js');
const posts = require('../data/posts.js');
const reports = require('../data/reports');
const connection = require('../config/mongoConnection');

async function main() {
    const db = await connection();
    await db.dropDatabase();
    //add users
    let u1=await users.createUser("un01@gmail.com","pw0101","nn01");  
    let u1_userid = u1._id.toHexString();
    let u2=await users.createUser("un02@gmail.com","pw0202","nn02");
    let u2_userid = u2._id.toHexString();
    let u3=await users.createUser("un03@gmail.com","pw0303","nn03");
    let u3_userid = u3._id.toHexString();
    let u4=await users.createUser("un04@gmail.com","pw0404","nn04");
    //add posts to u1
    let p1 = await posts.createPost("im topic01",u1_userid ,"im content01",["/images/burton01.jpg","/images/burton02.jpg"],["tagA","tagB","tagC"]);
    let p1_postid= p1._id.toHexString();
    let p2 = await posts.createPost("im topic02",u1_userid ,"im content02",["\images\danner_boots.jpg","\images\danner_boots01.jpg","\images\danner_boots03.jpg"],["tagD","tagB","tagC"]);
    let p3 = await posts.createPost("im topic03",u1_userid,"im content03",["photo01,photo03"],["tagA","tagD","tagC"]); 
    //add comment to p1
    let c1=await comments.addComment(p1_postid,u2_userid,"im comment content01");
    let c2=await comments.addComment(p1_postid,u3_userid,"im comment content02");

    await db.serverConfig.close();
    console.log('Done!');
}
main().catch((error) => {
    console.log(error);
});
