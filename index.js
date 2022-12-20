const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const db = require('./models');
const User = db.users;

const PORT = 8000;

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("assets"));

db.sequelize.sync({}).then(() => {
    console.log("Sync database...");
    // initial();
});

require('./routes/post.routes')(app);
// require('./routes/users.routes')(app);

app.listen(PORT, () => {
    console.log('Server is ready at port ' + PORT);
});

// function initial() {
//     User.create({
//         id: 1,
//         name: 'test',
//         profile: 'https://ca.slack-edge.com/T043Z584BDE-U0432R92K70-840def00f1eb-512',
//         email: "tes@gmail.com",
//         password: "admin123"
//     })
// }