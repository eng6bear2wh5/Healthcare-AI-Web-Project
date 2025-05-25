const jwt = require('jsonwebtoken'); 

const generateToken = (user) => {
    const payload = { 
        id: user.id, 
        role: user.role, 
    };
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN, algorithm: "HS256", }
    );
}

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET); 

module.exports = { generateToken, verifyToken };
