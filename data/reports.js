const mongoCollections = require('../config/mongoCollections');
const reports = mongoCollections.reports;
const { ObjectId } = require('mongodb');


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

async function getReportById(id)
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
    if (!postId || typeof postId !== "string") throw 'You must provide a post id for report';
    if (!userId || typeof userId !== "string") throw 'You must provide an user id for report';
    if (!reason || !Array.isArray(reason)) throw 'You must provide reason array for the report';

    const reportCollection = await reports();
    // check if the user has already reported 
    const existReport = await reportCollection.findOne({userId: userId, postId: postId}); 
    if(existReport == null)
    {
        let newReport = {
            userId: userId,
            postId: postId,
            reasons: reason
        };
        const insertInfo = await reportCollection.insertOne(newReport);
        if (insertInfo.insertedCount === 0) throw 'Could not add report';
        const newId = insertInfo.insertedId;
        const reportt = await this.getReport(newId);
        return reportt;
    }
    else{
        throw "you have already reported the post once"
    };
}

module.exports = {
    getAllReports,
    getReportById,
    addReport
}
