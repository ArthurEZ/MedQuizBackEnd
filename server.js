
const express = require('express');
const { xss } = require('express-xss-sanitizer');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require('dotenv').config({ path: './config/config.env' });
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors')

const app = express();

const connectDB = require('./config/db');
connectDB();

app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

const score = require('./routes/score');
app.use('/api/v1/score', score);

const auth = require('./routes/auth');
app.use('/api/v1/auth', auth);

const quiz = require('./routes/quiz')
app.use('/api/v1/quiz', quiz);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

process.on('unhandledRejection', (err, promise) => {
    console.error(`Error : ${err.message}`);
    server.close(() => process.exit(1));
});

process.on('uncaughtException', (err, promise) => {
    console.error(`Error : ${err.message}`);
    server.close(() => process.exit(1));
});