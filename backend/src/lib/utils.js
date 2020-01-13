const jwt = require('jsonwebtoken');

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

const addCookie = (req, res, next) => {
    const { user } = req;
    // create the JWT token for them
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // We set the jwt as a cookie on the response
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    next();
};

exports.addCookie = addCookie;
exports.hasPermission = hasPermission;
