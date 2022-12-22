const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.users;

const JWT_SECRET_KEY = 'ourtripteam7';

module.exports = async (req, res, next) => {
    const {authorization} = req.headers;
    const [ authType, authToken ] = (authorization || '').split(' ');
    try {
        const {id} = jwt.verify(authToken, JWT_SECRET_KEY);
        const user = await User.findByPk(id);
        if (user) {
            next();
        }
    } catch (error) {
        return res.status(401).send({
            errorMessage: 'Login is required'
        })
    }
}