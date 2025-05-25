const { verifyToken } = require('../helpers/tokenHelper');

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const decoded = verifyToken(token); 
        req.user = decoded; 
        next();
    } catch (error) {
        error.message = "Token không hợp lệ"
        error.statusCode = 404;
        next(error);
    }
};

module.exports = authenticateJWT;
