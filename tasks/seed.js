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
    let u1_userid = JSON.stringify(u1._id);
    u1_userid = u1_userid.replace(/\"/g, "");    
    let u2=await users.createUser("un02@gmail.com","pw0202","nn02");
    let u3=await users.createUser("un03@gmail.com","pw0303","nn03");
    let u4=await users.createUser("un04@gmail.com","pw0404","nn04");
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
