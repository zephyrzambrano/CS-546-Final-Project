const users = require('../data/users.js');
const comments = require('../data/comments.js');
const posts = require('../data/posts.js');
const reports = require('../data/reports');
const connection = require('../config/mongoConnection');

async function main() {
    const db = await connection();
    await db.dropDatabase();
    //add users

    let u1=await users.createUser("un01@gmail.com","$2a$10$S47.YnORnIZRLpMOSOINm.eUL4FoSLBFaWfk7qWT65.0c7unyjzGi","nn01");  //pw0101
    let u1_userid = u1._id.toHexString();
    let u2=await users.createUser("un02@gmail.com","$2a$10$0A53QP0G0oeux7RFlNUqHuK7j5GU3zJjgYj3IQk02s4SznXUmcBLS","nn02");//pw0202
    let u2_userid = u2._id.toHexString();
    let u3=await users.createUser("un03@gmail.com","$2a$10$2hDMVORERcJpQYDxhckLpeLtdOveKhEyFKeHFAfA4Qq6D62e4KfSe","nn03");//pw0303
    let u3_userid = u3._id.toHexString();
    let u4=await users.createUser("un04@gmail.com","$2a$10$ad7Epy4AAPfrmRruDCwocu8Kq1lpRYTIj/fiQJ5qI/qGkvv0Ng3r6","nn04");//pw0404
    //add posts to u1
    let p1 = await posts.createPost("im topic01",u1_userid ,"im content01",["http://localhost:3000/public/images/burton01.jpg","http://localhost:3000/public/images/burton02.jpg"],["Men","Sleepwear","Spring"]);
    let p1_postid= p1._id.toHexString();
    let p2 = await posts.createPost("im topic02",u1_userid ,"im content02",["http://localhost:3000/public/images/danner_boots.jpg","http://localhost:3000/public/images/danner_boots01.jpg","http://localhost:3000/public/images/danner_boots03.jpg"],["Women","Dress"]);

    let p3 = await posts.createPost("im topic03",u1_userid,"im content03",["http://localhost:3000/public/images/supreme01.jpg"],["Kid","Winter"]); 
    //add comment to p1
    let c1=await comments.addComment(p1_postid,u2_userid,"im comment content01");
    let c2=await comments.addComment(p1_postid,u3_userid,"im comment content02");

    await db.serverConfig.close();
    console.log('Done!');
}
main().catch((error) => {
    console.log(error);
});
