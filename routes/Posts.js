// Initialize router for Posts
const express = require('express');
const router = express.Router();
const { Posts, Likes } = require('../models');

const {validateToken} = require('../middlewares/AuthMiddleware');

// Making get & post requests
router.get("/", validateToken, async (req, res) => {
    const listOfPosts = await Posts.findAll({include: [Likes]});

    const likedPosts = await Likes.findAll({ where: {UserId: req.user.id} });
    
    res.json({listOfPosts: listOfPosts, likedPosts: likedPosts});
});

router.post("/", validateToken, async (req, res) => {
    const post = req.body;  // Getting the data
    post.username = req.user.username;
    post.UserId = req.user.id;
    await Posts.create(post);
    res.json(post);
});

// Making route to navigate to individual post
router.get('/byId/:id', async (req, res) => {
    const id = req.params.id;
    const post = await Posts.findByPk(id);
    res.json(post);
})

// Making route to show all a user's post under his/her profile
router.get('/byUserId/:id', async (req, res) => {
    const id = req.params.id;
    const listOfPosts = await Posts.findAll({ where: {UserId: id}, include: [Likes] });
    res.json(listOfPosts);
});

// Route to change title of the post
router.put("/title", validateToken, async (req, res) => {
    const { newTitle, id } = req.body;
    await Posts.update ({title: newTitle}, {where: {id: id}});
    res.json(newTitle);
});

// Route to change text of the post
router.put("/postText", validateToken, async (req, res) => {
    const { newText, id } = req.body;
    await Posts.update ({postText: newText}, {where: {id: id}});
    res.json(newTitle);
});

router.delete("/:postId", validateToken, async (req, res) => {
    const postId = req.params.postId;

    await Posts.destroy( { where: {id: postId} } ); 

    res.json("Post deleted.");
});

module.exports = router;