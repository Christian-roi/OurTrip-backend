const { create, update, destroy, getAll, getById } = require('../controllers/post.controller');
const { signup, login } = require('../controllers/users.controller');

module.exports = app => {
    app.post('/api/posts', create);
    app.put('/api/posts/:id', update);
    app.delete('/api/posts/:id', destroy);
    app.get('/api/posts', getAll);
    app.get('/api/posts/:id', getById);
    app.post('/api/signup', signup);
    app.post('/api/login', login);
}