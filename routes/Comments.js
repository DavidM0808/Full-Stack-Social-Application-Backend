// Initialize router for Comments
const express = require('express');
const router = express.Router();
const { Comments } = require('../models');
const {validateToken} = require('../middlewares/AuthMiddleware');

// Making route to navigate to individual post's comment section
router.get('/:postId', async (req, res) => {
    const postId = req.params.postId;
    const comments = await Comments.findAll({where: {PostId: postId}});
    res.json(comments);
})

// Making route that create comments
router.post('/', validateToken, async (req, res) => {
    const comment = req.body;
    const username = req.user.username;

    comment.username = username;
    await Comments.create(comment);
    res.json(comment);
});

// Making route for deleting comments
router.delete('/:commentId', validateToken, async (req, res) =>{
    const commentId = req.params.commentId;

    await Comments.destroy( { where: {id: commentId} } ); 

    res.json("Comment deleted.");
});

module.exports = router;