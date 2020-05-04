const users = require('../data/users.js');
const connection = require('../config/mongoConnection');

async function main() {
    let u1=await users.createUser("un01@gmail.com","pw0101","nn01");
    let u2=await users.createUser("un02@gmail.com","pw0202","nn02");
    let u3=await users.createUser("un03@gmail.com","pw0303","nn03");
    let u4=await users.createUser("un04@gmail.com","pw0404","nn04");
    let u5=await users.createUser("un05@gmail.com","pw0505","nn05");
    let u6=await users.createUser("un06@gmail.com","pw0606","nn06");
    let u7=await users.createUser("un07@gmail.com","pw0707","nn07");
    let u8=await users.createUser("un08@gmail.com","pw0808","nn08");
    let u9=await users.createUser("un09@gmail.com","pw0909","nn09");
    let u10=await users.createUser("un10@gmail.com","pw1010","nn10");
    let u11=await users.createUser("un11@gmail.com","pw1111","nn11");
    let u12=await users.createUser("un12@gmail.com","pw1212","nn12");
    // let u13=await users.createUser("unun01@gmail.com","pw","nn");
    // let u14=await users.createUser("unun01@gmail.com","pw","nn");

    console.log(u1);
    // let u4=await users.getUserById("5e9a4865c44e6d8048b0d3ce");
    // console.log(u4);
    // let u5=await users.getAllUsers();
    // console.log(u5);
    // let u6=await users.editPassword("5ea0e4052598f939fc576942","123456");
    // console.log(u6);
    // let u7=await users.editNickname("5ea0e4052598f939fc576942","Newnn01");
    // console.log(u7);
    // let u8=await users.editUsername("5ea0e4052598f939fc576942","Newun01");
    // console.log(u8);


    
    // let c0=await comments.getCommentById("5e9a56c42e7fa841cc7d4e33");
    // let c1=await comments.addComment("5e9a56c42e7fa841cc7d4e33","5e9a51977d3c73516c9c7a56","im comment content05");
    // let c2=await comments.addComment("5e9a56c42e7fa841cc7d4e33","5e9a51977d3c73516c9c7a56","im comment content02");
    // let c3=await comments.addComment("5e9a56c42e7fa841cc7d4e33","5e9a51977d3c73516c9c7a56","im comment content03");
    // let c1=await comments.addComment("5e9a56c42e7fa841cc7d4e33","5e9a51977d3c73516c9c7a56","im comment content06");
    // let c4=await comments.removeComment("5e9a56c42e7fa841cc7d4e33","5e9a7f698c9a195ae0be8d4b");

    // let c5=await comments.removeCommentOnly("5e9a56c42e7fa841cc7d4e33");
    
    const db = await connection();
    await db.serverConfig.close();
    console.log('Done!');
}
main().catch((error) => {
    console.log(error);
});
