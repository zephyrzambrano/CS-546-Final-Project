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
    let u4_userid = u4._id.toHexString();
    let u5=await users.createUser("un05@gmail.com","$2a$10$32lqGi/sY3G6IEnbDOwC5e1.6OLlu92Kkc/sYNR38240vfeJBwEkm","nn04");//pw0505
    let u5_userid = u5._id.toHexString();
    let u6=await users.createUser("un04@gmail.com","$2a$10$ZoH1i.W07uN/8OjP1vZGf.AAMFtp/eExMdzfzlrcb7VP9GX0MvfCm","nn04");//pw0606
    let u6_userid = u6._id.toHexString();
    
    //add posts to u1
    let p1 = await posts.createPost("im topic01",u1_userid ,"im content01",["http://localhost:3000/public/images/MS056S-898-1.jpg","http://localhost:3000/public/images/MS056S-898-3.jpg"],["Men","Party","Spring"]);
    let p1_postid= p1._id.toHexString();
    let p2 = await posts.createPost("im topic02",u1_userid ,"im content02",["http://localhost:3000/public/images/2019-07-03 072318.png","http://localhost:3000/public/images/2019-07-04 144325.png","http://localhost:3000/public/images/2019-07-04 230337.png"],["Women","Summer","Ceremony"]);

    let p3 = await posts.createPost("im topic03",u1_userid,"im content03",["http://localhost:3000/public/images/20170116133733.jpg","http://localhost:3000/public/images/3B7902A37177F9CF90584F582F07DDEB.jpg"],["Men","Autumn","Ceremony"]); 
    //add comment to p1
    let c1=await comments.addComment(p1_postid,u2_userid,"im comment content01");
    let c2=await comments.addComment(p1_postid,u3_userid,"im comment content02");

    await db.serverConfig.close();
    console.log('Done!');
}
main().catch((error) => {
    console.log(error);
});
//All tags have been list here
// Men 
// Women
// Kids
// Travel
// Hike
// Swim
// Sports
// Party
// Yoga
// Sleepwear
// Suit
// Dress
// Ceremony
// Spring
// Summer
// Autumn
// Winter
