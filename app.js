const express = require('express');
const mongoose = require('mongoose');
const connectDb = require('./config/db');
const authRoutes = require('./routes/authRoutes')
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const dotenv = require('dotenv');

connectDb();

const app = express();

dotenv.config();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/auth', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
