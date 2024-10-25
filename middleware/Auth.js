import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWTSECRET;

const isAuthentificated = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).send({ 
            error: "Access denied",
            success : false,
            status : 401 
        });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({ error: "access denied" });
    }
};

export default isAuthentificated;
