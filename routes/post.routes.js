const { create, update, destroy, getAll, getById, getUserPosts } = require('../controllers/post.controller');
const { buat, getComment, updateComment, getCommentByPost  } = require('../controllers/comment.controller');

module.exports = app => {
    app.post('/api/posts', create);
    app.put('/api/posts/:id', update);
    app.delete('/api/posts/:id', destroy);
    app.get('/api/posts', getAll);
    app.get('/api/posts/:id', getById);
    app.get('/api/user-posts/:user_id', getUserPosts);
    app.post('/comment/:postId', buat);
    app.get('/comment', getComment);
    app.put('/comment/:commentId', updateComment);
    app.get('/comment/:postId', getCommentByPost);
}







