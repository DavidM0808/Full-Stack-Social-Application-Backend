// Initializing API
const express = require('express');
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Initializing Database
const db = require('./models');

// Creating routers for server
const postRouter = require('./routes/Posts');
app.use("/posts", postRouter);
const commentsRouter = require('./routes/Comments');
app.use('/comments', commentsRouter);
const usersRouter = require('./routes/Users');
app.use('/auth', usersRouter);
const likesRouter = require('./routes/Likes');
app.use('/likes', likesRouter);

// Creating server & connect database
db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server is running on port 3001");
    });
});