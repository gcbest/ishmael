// .env configuring
require('dotenv').config();
require('./config/googleAuthStrategy');
require('./config/facebookAuthStrategy');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const createServer = require('./createServer');
const auth = require('./routes/auth');
const db = require('./db');

const server = createServer();
server.express.use(cookieParser());

server.express.use(passport.initialize());
server.express.use(passport.session());

server.express.use('/auth', auth);

// 1. decode the JWT so we can get the user Id on each request
server.express.use((req, res, next) => {
    const { token } = req.cookies;
    if (token) {
        const { userId } = jwt.verify(token, process.env.APP_SECRET);
        // put the userId onto the req for future requests to access
        req.userId = userId;
    }
    next();
});

// 2. Create a middleware that populates the user on each request

server.express.use(async (req, res, next) => {
    // if they aren't logged in, skip this
    if (!req.userId) return next();
    const user = await db.query.user(
        { where: { id: req.userId } },
        '{ id, permissions, email, name }'
    );
    req.user = user;
    next();
});

server.start(
    {
        cors: {
            credentials: true,
            origin: process.env.FRONTEND_URL,
        },
    },
    info => {
        // eslint-disable-next-line no-console
        console.log(`Server is now running on port http://localhost:${info.port}`);
    }
);
