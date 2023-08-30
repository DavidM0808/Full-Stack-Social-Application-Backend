#!/bin/sh

# This shell script installs the dependencies needed to start the server.

npm install -g nodemon
npm install -g cors --save
npm install -g express
npm install -g jsonwebtoken
npm install -g bcrypt
npm install -g mysql2
npm install -g sequelize
npm install -g sequelize-cli