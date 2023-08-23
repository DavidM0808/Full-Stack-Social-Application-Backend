// Initialize router for Posts
const express = require('express');
const router = express.Router();
const { Users} = require('../models');
const bcrypt = require('bcrypt');
const { validateToken } = require('../middlewares/AuthMiddleware');

const {sign} = require('jsonwebtoken');

// Making post request for registration (username and password)
router.post('/', async (req, res) => {
    const {username, password} = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username,
            password: hash,
        });
        res.json("REGISTRATION SUCCESS");
    });
})

// Making login route
router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const user = await Users.findOne({ where: {username: username} });

    if (!user || !password) res.json({ error: "This user does not exist." }); // check if the user is NULL

    bcrypt.compare(password, user.password).then(async (match) => {
        if (!match) res.json({ error: "Wrong username & password combination."});

        const accessToken = sign({ username: user.username, id: user.id }, "importantstuff");

        res.json({token: accessToken, username: username, id: user.id});
    });
});

router.get('/auth', validateToken, (req, res) => {
    res.json(req.user);
});

router.get('/basicinfo/:id', async (req, res) => {
    const id = req.params.id;

    const basicInfo = await Users.findByPk(id, {
        attributes: { exclude: ["password"] }
    });

    res.json(basicInfo);
});

router.put('/changepassword', validateToken, async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    const user = await Users.findOne({where: {username: req.user.username}});

    bcrypt.compare(oldPassword, user.password).then(async (match) => {
        if (!match) res.json({ error: "Wrong password."});

        bcrypt.hash(newPassword, 10).then((hash) => {
            Users.update({password: hash}, { where: {username: req.user.username }});
            res.json("SUCCESSFULLY CHANGED PASSWORD");
        });
    });

})

module.exports = router;