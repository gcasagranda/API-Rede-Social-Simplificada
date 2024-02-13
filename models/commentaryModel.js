const mongoose = require('mongoose');
const counter = require('./counterModel');

const commentaryModel = mongoose.Schema({
    _id:{ type: Number},
    content:{ type: String, required: true },
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId:{ type: Number, ref:'Post', required: true },
    createdAt:{ type: Date, default: Date.now }
}, { _id: false });

commentaryModel.pre('save', async function(next){
    const doc = this;
    try {
        const counterDoc = await counter.findOneAndUpdate({object: 'commentaryId'}, {$inc: {seq: 1}});
        doc._id = counterDoc.seq;
        return next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model('Commentary', commentaryModel);