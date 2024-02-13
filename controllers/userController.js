const User = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports = {
    async postSignUp(req, res){
        const { firstname, lastname, nickname, password } = req.body;
        const existingUser = await User.findOne({ nickname });
        if (existingUser) {
            return res.status(400).send('Nickname já existe');
        }
        new User({
            firstname,
            lastname,
            nickname,
            password
        }).save().then(() => {
            res.status(200).send('Usuário cadastrado com sucesso');
        }).catch((err) => {
            res.status(500).send('Internal Server Error' + err);
        });
    },

    async deleteUser(req, res) {
        try {
            const { nickname } = req.params;
            if( nickname !== req.session.nickname){
                return res.status(403).send('Você não tem permissão para deletar este usuário');
            } else {
                const user = await User.findOneAndDelete({ nickname });
                if (!user) {
                    return res.status(404).send('Usuário não encontrado');
                }
                res.status(200).send('Usuário deletado com sucesso');
            } 
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    },

    async editUser(req, res) {
        try {
            const { originalNickname } = req.params;
            const { firstname, lastname, nickname, password } = req.body;
            if (originalNickname !== req.session.nickname){
                return res.status(403).send('Você não tem permissão para editar este usuário');
            } else{
                let hashedPassword = password;
                if (password) {
                    const salt = await bcrypt.genSalt(10);
                    hashedPassword = await bcrypt.hash(password, salt);
                }
                const updatedUser = await User.findOneAndUpdate(
                    { nickname: originalNickname},
                    { firstname, lastname, nickname, password: hashedPassword },
                    { new: true }
                );
                if (!updatedUser) {
                    return res.status(404).send('Usuário não encontrado');
                }
                req.session.nickname = nickname;
                res.status(200).json({message: 'Usuário atualizado com sucesso', user: updatedUser});
            }            
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    },

    async getPopularUsers (req,res){
        const users = await User.find({}).sort({totalLikes: -1}).limit(3);
        if (!users) {
            return res.status(404).send('Usuários não encontrados');
        }
        res.status(200).send(users);
    },

    async getUserByNickname (req,res){
        const {nickname} = req.params;
        const user = await User.findOne({ nickname: nickname });
        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }
        res.status(200).send(user);
    },

    async getUsersByName (req,res){
        const { name } = req.params;
        const users = await User.find({ firstname: name });
        if (!users) {
            return res.status(404).send('Usuários não encontrados');
        }
        res.status(200).send(users);
    }
} 