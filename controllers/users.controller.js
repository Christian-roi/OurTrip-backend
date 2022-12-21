const db = require('../models');
const User = db.users;
const Bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = 'ourtripteam7';

// Blok kode untuk menambahkan data user baru
exports.signup = (req, res) => {
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
    };

    User.findOne({ where: { email: userData.email } })
        .then((user) => {
            if (!user) {
                const hash = Bcrypt.hashSync(userData.password, 10);
                userData.password = hash;
                User.create(userData)
                    .then((user) => {
                        res.json({ status: user.email + ' registered!' });
                    })
                    .catch((err) => {
                        res.send('error: ' + err);
                    });
            }
            else {
                res.json({ error: 'User already exists' });
            }
        })
        .catch((err) => {
            res.send('error: ' + err);
        }
    );
};

// Blok kode untuk login user
exports.login = (req, res) => {
    User.findOne({ where: { email: req.body.email },
    })
        .then((user) => {
            if (user) {
                if (Bcrypt.compareSync(req.body.password, user.password)) {
                   const token = jwt.sign(user.dataValues, JWT_SECRET_KEY, {
                        expiresIn: '2 days',
                    });
                    res.json({
                        id: user.dataValues.id,
                        first_name: user.dataValues.first_name,
                        last_name: user.dataValues.last_name,
                        email: user.dataValues.email,
                        token: token,
                    });
                }else {
                    res.status(400).json({ error: 'Invalid password' });
                }
            }
            else {
                res.json({ error: 'User does not exist' });
            }
        })
        .catch((err) => {
            res.send('error: ' + err);
        }
    );
};
