const mongoose = require('mongoose');
const counter = require('./counterModel');

const postModel = mongoose.Schema({
    _id:{ type: Number},
    content:{ type: String, required: true },
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt:{ type: Date, default: Date.now },
    likes:[{ likedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}}]
}, { _id: false });

postModel.pre('save', async function(next){
    const doc = this;
    try {
        const counterDoc = await counter.findOneAndUpdate({object: 'postId'}, {$inc: {seq: 1}});
        doc._id = counterDoc.seq;
        return next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model('Post', postModel);