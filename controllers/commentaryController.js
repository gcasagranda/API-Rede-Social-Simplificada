const Commentary = require('../models/commentaryModel');
const Post = require('../models/postModel');

module.exports = {
    async postCreateCommentary(req, res){
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).send('Usuário não logado');
        }
        const dbPost = await Post.findOne({ _id: postId });
        if (!dbPost) {
            return res.status(404).send('Post não encontrado');
        }
        new Commentary({
            content,
            userId,
            postId
        }).save().then(() => {
            res.status(200).send('Comentário criado com sucesso');
        }).catch((err) => {
            res.status(500).send('Internal Server Error' + err);
        });
    },
    async deleteCommentary(req, res){
        try {
            const {commentaryId} = req.params;
            const userId = req.session.userId;
            if (!userId) {
                return res.status(401).send('Você não está logado');
            }
            const db_commentary = await Commentary.findOne({_id: commentaryId});
            if (userId !== String(db_commentary.userId)) {
                return res.status(403).send('Você não tem permissão para deletar este comentário');
            }
            const commentary = await Commentary.findOneAndDelete({_id: commentaryId});
            if (!commentary) {
                return res.status(404).send('Comentário não encontrado');
            }
            res.status(200).send('Comentário deletado com sucesso');
        } catch (error) {
            res.status(404).send('Comentário não encontrado');
        }
    },
    async getCommentariesByPost(req, res){
        const {postId} = req.params;
        const post = await Post.findOne({_id: postId});
        if (!post) {
            return res.status(404).send('Post não encontrado');
        }
        const commentaries = await Commentary.find({postId: postId}).sort({ createdAt: 1 });
        res.status(200).send(commentaries);
    }
}