const users = require('../data/users.js');
const comments = require('../data/comments.js');
const posts = require('../data/posts.js');
const reports = require('../data/reports');
const connection = require('../config/mongoConnection');

async function main() {
    const db = await connection();
    await db.dropDatabase();
    //add users
    let u1 = await users.createUser("un01@gmail.com", "$2a$10$S47.YnORnIZRLpMOSOINm.eUL4FoSLBFaWfk7qWT65.0c7unyjzGi", "Donglin");
    let u1_userid = u1._id.toHexString();
    let u1_admin = await users.setAdminAccess(u1_userid);//set user1 as Admin
    let u2 = await users.createUser("un02@gmail.com", "$2a$10$0A53QP0G0oeux7RFlNUqHuK7j5GU3zJjgYj3IQk02s4SznXUmcBLS", "Yaolin");
    let u2_userid = u2._id.toHexString();
    let u2_admin = await users.setAdminAccess(u2_userid);//set user2 as Admin
    let u3 = await users.createUser("un03@gmail.com", "$2a$10$2hDMVORERcJpQYDxhckLpeLtdOveKhEyFKeHFAfA4Qq6D62e4KfSe", "Jiayi");
    let u3_userid = u3._id.toHexString();
    let u3_admin = await users.setAdminAccess(u3_userid);//set user3 as Admin
    let u4 = await users.createUser("un04@gmail.com", "$2a$10$ad7Epy4AAPfrmRruDCwocu8Kq1lpRYTIj/fiQJ5qI/qGkvv0Ng3r6", "Zephyr");
    let u4_userid = u4._id.toHexString();
    let u4_admin = await users.setAdminAccess(u4_userid);//set user4 as Admin
    let u5 = await users.createUser("un05@gmail.com", "$2a$10$32lqGi/sY3G6IEnbDOwC5e1.6OLlu92Kkc/sYNR38240vfeJBwEkm", "nn05");
    let u5_userid = u5._id.toHexString();
    let u6 = await users.createUser("un06@gmail.com", "$2a$10$ZoH1i.W07uN/8OjP1vZGf.AAMFtp/eExMdzfzlrcb7VP9GX0MvfCm", "nn06");
    let u6_userid = u6._id.toHexString();
    let u7 = await users.createUser("un07@gmail.com", "$2a$10$vdXj7OW0b/rFJI3u1m/9QO1wVdVD5gWKaeBIk8t7hfVlTkokZlERy", "nn07");
    let u7_userid = u7._id.toHexString();
    let u8 = await users.createUser("un08@gmail.com", "$2a$10$9I1P3X89WLNzHRaTNRDJEuIPJl90TavRC8Gecy0p6bCf1WX7Nih66", "nn08");
    let u8_userid = u8._id.toHexString();

    //u1 create posts
    let p1 = await posts.createPost(
        "Super cool textured shirt",
        u1_userid,
        "Although this shirt is thin and not very warm, it is super expensive. Do you think this shirt is worth $499.99 (not including tax)?",
        ["http://localhost:3000/public/images/MS056S-898-1.jpg", "http://localhost:3000/public/images/MS056S-898-3.jpg"],
        ["Men", "Party", "Spring", "Autumn"]
    );
    let p1_postid = p1._id.toHexString();
    let p2 = await posts.createPost(
        "A sexy bunny outfitsg",
        u1_userid,
        "Let me tell you a cold knowledge, unlike other mammals, rabbits are in estrus all year round! If you want to watch more , you can subscribe to me on pornhub to get my fans-only videos",
        ["http://localhost:3000/public/images/072318.png", "http://localhost:3000/public/images/144325.png", "http://localhost:3000/public/images/230337.png"],
        ["Women", "Summer", "Ceremony"]
    );
    let p2_postid = p2._id.toHexString();
    let p3 = await posts.createPost(
        "Higher belt, higher level of knowledge",
        u1_userid,
        "Whenever I feel like I don't have enough knowledge, I raise my belt a little, and it works.But lately I've found that my minute is only 59 seconds",
        ["http://localhost:3000/public/images/20170116133733.jpg", "http://localhost:3000/public/images/3B7902A37177F9CF90584F582F07DDEB.jpg"],
        ["Men", "Autumn", "Suit", "Spring"]
    );
    let p3_postid = p3._id.toHexString();

    //u2 create post(Yaolin)
    let p4 = await posts.createPost(
        "LIGHTWEIGHT. VERSATILE. CLASSIC. Boots",
        u2_userid,
        "Made in our Portland, Oregon, factory, the Mountain Pass was created to be a lighter weight and more versatile hiking boot that still reflects our classic Danner styling.",
        ["http://localhost:3000/public/images/danner_boots.jpg", "http://localhost:3000/public/images/danner_boots01.jpg"],
        ["Men", "Hike"]
    );
    let p5 = await posts.createPost(
        "My best Burton for snowboarding",
        u2_userid,
        "Colorful, useful, satisfied",
        ["http://localhost:3000/public/images/burton01.jpg", "http://localhost:3000/public/images/burton02.jpg"],
        ["Women","Winter","Sports"]
    );
    let p6 = await posts.createPost(
        "Supreme Takashi Murakami COVID-19 Relief Box Logo Tee White",
        u2_userid,
        "Supreme has collaborated with Takashi Murakami for an exclusive COVID-19 Relief Box Logo Tee. Supreme will donate 100% of the proceeds to charity in support of youth and families facing homelessness during the COVID-19 crisis.",
        ["http://localhost:3000/public/images/supreme01.jpg", "http://localhost:3000/public/images/supreme02.jpg"],
        ["Men","Women","Summer","Party"]
    );

    //u3 create posts(Jiayi)
    let p7 = await posts.createPost(
        "Buffy Jecket",
        u3_userid,
        "In winter, it is usually cold in Beijing, So this is what we wear when it comes into Nov.",
        ["http://localhost:3000/public/images/BuffyJecket.jpg"],
        ["Men","Winter","Travel"]
    );
    let p8 = await posts.createPost(
        "Sweater",
        u3_userid,
        "I love colorful sweaters, which are usually wore in autumn, it's a kind of cloth that can always show fashion.",
        ["http://localhost:3000/public/images/Sweater.jpg"],
        ["Men","Winter","Party"]
    );
    let p9 = await posts.createPost(
        "My Jeans",
        u3_userid,
        "I love wearing jeans, it's so coooooooool!",
        ["http://localhost:3000/public/images/Jeans.jpg"],
        ["Men","Spring","Autumn","Party"]
    );

    //u4 create posts(Zephyr)
    let p10 = await posts.createPost(
        "Ski Gear",
        u4_userid,
        "I bought this amazing ski gear online, and I just got the chance to use it last weekend! I would highly recommend!",
        ["http://localhost:3000/public/images/ski-gear.jpeg"],
        ["Men","Winter","Sports"]
    );
    let p11 = await posts.createPost(
        "Outdoor Boots",
        u4_userid,
        "I really like these boots. They are great for hiking through the mud!",
        ["http://localhost:3000/public/images/boots.jpg"],
        ["Men","Spring","Autumn","Travel"]
    );
    let p12 = await posts.createPost(
        "Winter Jackets",
        u4_userid,
        "I have a huge collection of winter jackets. You can never have too many jacket choices!",
        ["http://localhost:3000/public/images/jackets.jpeg"],
        ["Men","Women","Travel"]
    );

    //add comment to p1
    let c1 = await comments.addComment(p2_postid, u3_userid, "The subscription costs $99/month.You must be kidding. Could you make a discount?");
    let c2 = await comments.addComment(p3_postid, u2_userid, "I think trump should raise his belt");

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
