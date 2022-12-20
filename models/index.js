const config = require('../db/config');

const Sequalize = require('sequelize');
const sequelize = new Sequalize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
    },
);

const db = {};

db.Sequalize = Sequalize;
db.sequelize = sequelize;

db.users = require('./Users')(sequelize, Sequalize);
db.posts = require('./Posts')(sequelize, Sequalize);
db.comments = require('./Comments')(sequelize, Sequalize);

db.posts.belongsTo(db.users, {
    foreignKey: 'user_id',
    onDelete: 'cascade',
    as: 'user'
});

db.comments.belongsTo(db.users, {
    foreignKey: 'userId',
    onDelete: 'cascade',
    as: 'user'
});

db.posts.hasMany(db.comments, {
    foreignKey: 'postId',
    onDelete: 'cascade',
    as: 'comments'
});

module.exports = db;