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
    let u3=await users.createUser("un03@gmail.com","pw0303","nn03");
    let u4=await users.createUser("un04@gmail.com","pw0404","nn04");
    //add users with bcrypt password
    let u5=await users.createUser("un05@gmail.com","$2a$05$UTV7UVGnuFtCoKHz1MS/3.ID9RX/JLg/DBRPE8AuR9yh1vLVRQ6/m","nn05");// password is pw0505
    let u6=await users.createUser("un06@gmail.com","$2a$05$mQDuhdWIkgj9ZAn3KM9NQux4SZrrM3890DLnyppjzN/8XX.d7aI0a","nn06");// password is pw0606
    //add posts to u1
    let a1 = await posts.createPost("im topic01",u1_userid ,"im content01",["photo01,photo02"],["tagA","tagB","tagC"]);
    let a2 = await posts.createPost("im topic02",u1_userid ,"im content02",["photo03,photo02"],["tagD","tagB","tagC"]);
    let a3 = await posts.createPost("im topic03",u1_userid,"im content03",["photo01,photo03"],["tagA","tagD","tagC"]); 
    await db.serverConfig.close();
    console.log('Done!');
}
main().catch((error) => {
    console.log(error);
});
