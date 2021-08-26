const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const users = require('./routers/user');
const book = require('./routers/books');
const order = require('./routers/orders');
const request=require('./routers/request')
require('dotenv').config();
let port = process.env.PORT;
let db = process.env.DB
const app = express();
app.use(express.json());
app.use(cors());

mongoose
    .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log('MongoDB Connnected');
    })
    .catch((err) => {
        console.log({ err: err });
    });
app.use('/users', users);
app.use('/book', book);
app.use('/order', order)
app.use('/request',request)
app.listen(port, () =>
    console.log(`Server running on port ${port}`));