// Generating table for comments
module.exports = (sequelize, DataTypes) => {

    const Likes = sequelize.define("Likes");
    
    return Likes;
};