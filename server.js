const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');


const app = express();
app.use(cors());

//Body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json({extended: false}));

//call mongodb method

const mongoDB = require('./config/db');
mongoDB();

app.use('/api', require('./routes/index'));
app.use('/api/auth', require('./routes/auth'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static( 'client/build' ));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')); // relative path
    });
}
const port = process.env.PORT || 5000;

app.listen(port, ()=>console.log(`server is running on port ${port}`))
