const User = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports = {
    async login(req,res){
        const { nickname, password } = req.body;
        try {
            const dbUser = await User.findOne({nickname});
            if (!dbUser) {
                return res.status(400).send('Usuário não encontrado');
            } else {
                const passwordMatch = await bcrypt.compare(password, dbUser.password);
                if (passwordMatch) {
                    req.session.userId = dbUser._id;
                    req.session.nickname = nickname;
                    res.status(200).send('Login bem-sucedido');
                } else {
                res.status(401).send('Senha incorreta');
                }
            }
        }catch (error) {
            return res.status(500).send('Internal Server Error');
        }
    },
    async logout(req,res){
        req.session.destroy();
        res.status(200).send('Logout bem-sucedido');
    }
}