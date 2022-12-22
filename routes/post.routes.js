const { create, update, destroy, getAll, getById, getUserPosts } = require('../controllers/post.controller');
const { buat, getComment, updateComment, getCommentByPost  } = require('../controllers/comment.controller');
const { signup, login } = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth-middleware');

module.exports = app => {
    app.post('/api/posts', authMiddleware, create);
    app.put('/api/posts/:id', authMiddleware, update);
    app.delete('/api/posts/:id', authMiddleware, destroy);
    app.get('/api/posts', getAll);
    app.get('/api/posts/:id', getById);
    app.post('/api/signup', signup);
    app.post('/api/login', login);
    app.get('/api/user-posts/:user_id', getUserPosts);
    app.post('/comment/:postId', authMiddleware, buat);
    app.get('/comment', getComment);
    app.put('/comment/:commentId', authMiddleware, updateComment);
    app.get('/comment/:postId', getCommentByPost);
}







