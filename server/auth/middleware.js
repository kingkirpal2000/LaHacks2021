const jwt = require('jsonwebtoken');

function checktokenSetUser(req, res, next) {
    const authToken = req.get('Authorization');
    // console.log(authToken);
    if (authToken) {
        const token = authToken.split(' ')[1];
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    console.log(err);
                }
                req.user = decoded;
                /* req.user = {
                   _id: '60068e5cbd493149e02e993e',
                  email: 'test@test.com',
                  accessToken: 'test123test123test123',
                  iat: 1611042396,
                  exp: 1611128796
                }*/
                next();
            });
        } else {
            next();
        }
    } else {
        next();
    }
}

function isLoggedin(req, res, next) {
    if (req.user) {
        next();
    } else {
        const error = new Error("--Unauthorized User--");
        next(error);
    }
}

function unAuthorized(res, next) {
    const error = new Error('🚫 Un-Authorized 🚫');
    res.status(401);
    next(error);
}

module.exports = {
    checktokenSetUser,
    isLoggedin,
    unAuthorized,
};
