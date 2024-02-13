const express = require('express');
const route = express.Router();
const userController = require('../controllers/userController');
const loginController = require('../controllers/loginController');
const postController = require('../controllers/postController');
const commentaryController = require('../controllers/commentaryController');

route.post('/login', loginController.login);
route.post('/logout', loginController.logout);
route.post('/signup', userController.postSignUp);
route.delete('/user/:nickname', userController.deleteUser);
route.put('/user/edit/:originalNickname', userController.editUser);
route.get('/user/nickname/:nickname', userController.getUserByNickname);
route.get('/user/name/:name', userController.getUsersByName);
route.post('/post', postController.postCreatePost);
route.delete('/post/:postId', postController.deletePost);
route.get('/post/id/:postId', postController.getPostById);
route.get('/post/user/:userNickname', postController.getPostsByUser);
route.post('/commentary/postid/:postId', commentaryController.postCreateCommentary);
route.delete('/commentary/:commentaryId', commentaryController.deleteCommentary);
route.get('/commentary/postid/:postId', commentaryController.getCommentariesByPost);
route.post('/post/like/:postId', postController.likePost);
route.get('/user/popular', userController.getPopularUsers);



module.exports = route;