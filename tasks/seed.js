const users = require('../data/users.js');
const comments = require('../data/comments.js');
const posts = require('../data/posts.js');
const reports = require('../data/reports');
const connection = require('../config/mongoConnection');

async function main() {
    const db = await connection();
    await db.dropDatabase();
    //add users with bcrypt password
    let u5=await users.createUser("un05@gmail.com","$2a$05$UTV7UVGnuFtCoKHz1MS/3.ID9RX/JLg/DBRPE8AuR9yh1vLVRQ6/m","nn05");// password is pw0505
    let u5_userid = u5._id.toHexString();
    let u6=await users.createUser("un06@gmail.com","$2a$05$mQDuhdWIkgj9ZAn3KM9NQux4SZrrM3890DLnyppjzN/8XX.d7aI0a","nn06");// password is pw0606
    let u6_userid = u6._id.toHexString();
    //add posts to u5
    let p1 = await posts.createPost("im topic01",u5_userid ,"im content01",["http://localhost:3000/public/images/burton01.jpg","http://localhost:3000/public/images/burton02.jpg"],["Men","Sleepwear","Spring"]);
    let p1_postid= p1._id.toHexString();
    let p2 = await posts.createPost("im topic02",u5_userid ,"im content02",["http://localhost:3000/public/images/danner_boots.jpg","http://localhost:3000/public/images/danner_boots01.jpg","http://localhost:3000/public/images/danner_boots03.jpg"],["Women","Dress"]);
    let p3 = await posts.createPost("im topic03",u5_userid,"im content03",["http://localhost:3000/public/images/supreme01.jpg"],["Kid","Winter"]); 
    //add comment to p1
    let c1=await comments.addComment(p1_postid,u5_userid,"im comment content01");
    let c2=await comments.addComment(p1_postid,u6_userid,"im comment content02");
    await db.serverConfig.close();
    console.log('Done!');
}
main().catch((error) => {
    console.log(error);
});
