const Post = require('../models/postModel');
const User = require('../models/userModel');

module.exports = {
    async postCreatePost (req,res){
        const { content } = req.body;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).send('Você não está logado');
        }
        new Post({
            content,
            userId
        }).save().then(() => {
            res.status(200).send('Post criado com sucesso');
        }).catch((err) => {
            res.status(500).send('Internal Server Error' + err);
        });
    },

    async deletePost (req,res){
        try {
            const { postId } = req.params;
            const userId = req.session.userId;
            if (!userId) {
                return res.status(401).send('Você não está logado');
            }
            const dbPost = await Post.findOne({ _id: postId });
            if (userId !== String(dbPost.userId)) {
                return res.status(403).send('Você não tem permissão para deletar este post');
            }
            const post = await Post.findOneAndDelete({ _id: postId });
            if (!post) {
                return res.status(404).send('Post não encontrado');
            }
            res.status(200).send('Post deletado com sucesso');
        } catch (error) {
            res.status(404).send('Post não encontrado');
        }
    },

    async getPostById (req,res){
        const { postId } = req.params;
        const post = await Post.findOne({ _id: postId }).populate('userId', 'nickname').populate('likes.likedBy', 'nickname');
        if (!post) {
            return res.status(404).send('Post não encontrado');
        }
        res.status(200).send(post);
    },

    async getPostsByUser (req,res){
        const { userNickname } = req.params;
        const dbUser = await User.findOne({ nickname: userNickname });
        if (!dbUser) {
            return res.status(404).send('Usuário não encontrado');
        }
        const posts = await Post.find({ userId: dbUser._id }).populate('userId', 'nickname').populate('likes.likedBy', 'nickname').sort({ createdAt: 1 });
        if (!posts) {
            return res.status(404).send('Posts não encontrados');
        }
        res.status(200).send(posts);
    },

    async likePost(req, res) {
        const { postId } = req.params;
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).send('Você não está logado');
        }
        try {
            const dbPost = await Post.findOne({ _id: postId });
            if (!dbPost) {
                return res.status(404).send('Post não encontrado');
            }
            const userLikedIndex = dbPost.likes.findIndex((like) => {
                return String(like.likedBy) === String(userId);
            });
            if (userLikedIndex !== -1) {
                return res.status(403).send('Você já curtiu este post');
            }
            const likeobject = {
                likedBy: userId
            };
            var liked = await Post.updateOne({ _id: postId }, { $push: { likes: likeobject } }, { upsert: true });
            await User.updateOne({ _id: dbPost.userId }, { $inc: { totalLikes: 1 } });
            if (!liked) {
                res.status(500).send('Erro ao curtir post');
            } else {
                res.status(200).send('Post curtido com sucesso');
            }
        } catch (error) {
            console.error('Erro ao curtir post:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}