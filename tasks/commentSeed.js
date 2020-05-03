const comments = require('../data/comments.js');
const posts = require('../data/posts.js');
const reports = require('../data/reports');
const users = require('../data/users.js');
const connection = require('../config/mongoConnection');

async function main() {

    let c1=await comments.addComment("5eae3bfe1e94fe9eb44ee2e3","5eae3a8a6bfe4e96dc87f134","im comment content01");

    let c2=await comments.addComment("5eae3bfe1e94fe9eb44ee2e3","5eae3a8a6bfe4e96dc87f135","im comment content02");

    
    // let c2=await comments.removeComment("5e9a56c42e7fa841cc7d4e33","5e9a81e4e05a6657d4e85388");
    
    // let p1=await posts.removePost("5e9a79087f1f5472a06bd46e");
    
    const db = await connection();
    await db.serverConfig.close();
    console.log('Done!');
}


main().catch((error) => {
    console.log(error);
});
