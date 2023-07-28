var jwt = require('jsonwebtoken');
const { secret } = require('./config');


function verifyToken(req, res, next) {
    // var token = req.headers['x-access-token'];
    // console.log(req.headers);
    // console.log(req.headers['authorization']);

    let token;
    let authheader = req.headers['authorization'];

    if (authheader)
        token = authheader.split(" ")[1];

    if (!token) return res.json({ status: 'failed', auth: false, message: 'No token provided' });

    jwt.verify(token, secret, function (err, decoded) {
        if (err || !decoded) return res.json({ status: 'failed', auth: false, message: 'Invalid token' });

        // if everything good, save to request for use in other routes
        req.verifiedUser = decoded;
        next();
    });
}

module.exports = verifyToken;