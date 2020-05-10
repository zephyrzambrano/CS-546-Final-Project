const mongoCollections = require('../config/mongoCollections');
const reports = mongoCollections.reports;
const { ObjectId } = require('mongodb');



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
    if (!reason || !Array.isArray(reason)) throw ' You must select at least a reason for reporting';
    const reportCollection = await reports();
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
        const reportt = await this.getReportById(newId);
        return reportt;
    }
    else{
        throw "you have already reported the post once"
    };
}

async function removeReport(reportId) {
    if (!reportId || typeof reportId !== "string") throw 'You must provide a reportId id';
    let reportObjId = ObjectId.createFromHexString(reportId);
    const reportCollection = await reports()
    let deletionInfo = await reportCollection.removeOne({ _id: reportObjId });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete the band with id of ${id}`;
    }
    return true;
}

module.exports = {
    getAllReports,
    getReportById,
    addReport,
    removeReport
}
