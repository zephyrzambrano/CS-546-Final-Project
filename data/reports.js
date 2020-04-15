const mongoCollections = require('../config/mongoCollections');
const reports = mongoCollections.reports;
const { ObjectId } = require('mongodb');
// add more mongoCollections if needed


// Uncomment require statements these if needed

// const posts = require('./posts');
// const comments = require('./comments');






// insert functions here
async function getAllReports() {
    try 
    {
        const reportCollection = await reports();

        const allReports = await reportCollection.find({}).toArray();

        return allReports;
    } 
    catch (error) 
    {
        console.log(error);
    }
}

async function getReport(id)
{
    if (!id) throw 'You must provide an id to search for report';
    if(typeof id =="string")
    {
        const objId = ObjectId.createFromHexString(id);
        id = objId;
    }

    const reportCollection = await reports();
    const reportt = await reportCollection.findOne({_id: id});
    if (reportt === null) throw 'No report with that id';

    return reportt;
}

async function addReport(userId,postId,reason)
{
    if (!postId || typeof postId !== "string") throw 'You must provide a post id for a report';
    if (!userId || typeof userId !== "string") throw 'You must provide an user id for a report';
    userjId = ObjectId.createFromHexString(userId);
    postId = ObjectId.createFromHexString(postId);

    const reportCollection = await reports();
    //check if the user has already reported 
    const existReport = await reportCollection.findOne({userId: userId, postId: postId}); //not sure if it's work
    if(existReport == null)
    {
        let newReport = {
            userId: userId,
            postId: postId,
            reasons: [reason]//not sure if it's work
        };
        const insertInfo = await reportCollection.insertOne(newReport);
        if (insertInfo.insertedCount === 0) throw 'Could not add report';
        const newId = insertInfo.insertedId;
        const reportt = await this.getReport(newId);
        return reportt;
    }
    await reportCollection.updateOne({_id: existReport._id}, {$addToSet: {resons:reason}});//check input id
    return existReport;
}





module.exports = {getAllReports,getReport,addReport}
