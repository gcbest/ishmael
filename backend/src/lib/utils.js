const jwt = require('jsonwebtoken');
const db = require('../db');

const hasPermission = (user, permissionsNeeded) => {
    const matchedPermissions = user.permissions.filter(permissionTheyHave =>
        permissionsNeeded.includes(permissionTheyHave)
    );
    if (!matchedPermissions.length) {
        // eslint-disable-next-line prettier/prettier
        throw new Error(`You do not have sufficient permissions: ${permissionsNeeded} You Have: ${user.permissions}`);
    }
    return true;
};

const setCookie = (user, res) => {
    // create the JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // We set the jwt as a cookie on the response
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
};

const setCookieAndRedirect = (req, res) => {
    const { user } = req;
    setCookie(user, res);
    res.send('reached callback uri');
};

const findOrCreateUser = async (profile, authType, cb) => {
    const user = await db.query.user({ where: { id: profile.id } }, '{ id }');
    if (user) return cb(null, user);

    const newUser = await db.mutation
        .createUser({
            data: {
                id: profile.id,
                name: profile.displayName,
                authType,
                permissions: { set: ['USER'] },
            },
        })
        .catch(err => {
            throw Error(`Could not create user: ${err}`);
        });
    return cb(null, newUser);
};

module.exports = {
    hasPermission,
    setCookie,
    setCookieAndRedirect,
    findOrCreateUser,
};
