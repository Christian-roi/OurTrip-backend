module.exports = (sequelize, Sequelize) => {
    const Posts = sequelize.define(
        'posts',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: Sequelize.STRING,
            },
            place: {
                type: Sequelize.STRING,
            },
            image: {
                type: Sequelize.STRING,
            },
            content: {
                type: Sequelize.TEXT,
            },
            user_id: {
                type: Sequelize.INTEGER,
            },
        },
    );
    return Posts;
}