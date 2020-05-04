const comments = require('../data/comments.js');
const posts = require('../data/posts.js');
const reports = require('../data/reports');
const users = require('../data/users.js');
const connection = require('../config/mongoConnection');

async function main() {

    let a1 = await posts.createPost("im topic01","5eae3a8a6bfe4e96dc87f133","im content01",["photo01,photo02"],["tagA","tagB","tagC"])
    let a2 = await posts.createPost("im topic02","5eae3a8a6bfe4e96dc87f133","im content02",["photo03,photo02"],["tagD","tagB","tagC"])
    let a3 = await posts.createPost("im topic03","5eae3a8a6bfe4e96dc87f133","im content03",["photo01,photo03"],["tagA","tagD","tagC"])
    console.log(a1);
    // let a4 = await posts.getPostByString("02");
    // console.log(a4);
    // let a5=await posts.getPostByOneTag("tagE");
    // console.log(a5);
    // let a6=await posts.getPostByMultTag(["tagA","tagB","tagE"]);
    // let a6=await posts.getPostByMultTag(["tagA"]);
    // console.log(a6);
    // let a7=await posts.editContent("5e910d8a91cadf6e1800b68a","im new content01")
    // console.log(a7);
    // let a8=await posts.addLikeCount("5e910d8a91cadf6e1800b68f","0002");
    // console.log(a8);
    // let a9=await posts.addDislikeCount("5e910d8a91cadf6e1800b68f","0002");
    // console.log(a9);
    // let a10=await posts.addViewCount("5e910d8a91cadf6e1800b68f");
    // console.log(a10);
    // let a11=await posts.removePost("5e9a52b5a9746582805dd4bc");
    // console.log(a11);


    // let c1=await comments.addComment("5e9a56c42e7fa841cc7d4e34","5e9a51977d3c73516c9c7a56","im comment content08")
    
    // let c2=await comments.removeComment("5e9a56c42e7fa841cc7d4e33","5e9a81e4e05a6657d4e85388");
    
    // let p1=await posts.removePost("5e9a56c42e7fa841cc7d4e33");
    
    // let r1=await reports.addReport("user01","postId",["reason02"]);
    // let r2=await reports.getReportById("5e9b5ad6e7265b2a20ca1f12");
    // console.log(r2);
    // let r3=await reports.getAllReports();
    // console.log(r3);

    // let u1=await users.createUser("un01","0101","nn01");

    const db = await connection();
    await db.serverConfig.close();
    console.log('Done!');
}


main().catch((error) => {
    console.log(error);
});
