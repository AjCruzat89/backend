//<!--===============================================================================================-->
const { Op, fn, col, literal, where } = require("sequelize");
const db = require('../models');
const { User } = db;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'capstone_jwt';
const blacklist = require('./blacklist');
//<!--===============================================================================================-->
exports.register = async (req, res) => {
    try{
        const newUser = await User.create(req.body);
        res.status(200).json({ message: 'User created successfully' });
    }
    catch(err){
        res.status(500).json({ error: err.errors.map(e => e.message) });
    }
}
//<!--===============================================================================================-->
exports.login = async (req, res) => {
    try {
        const user = await User.findOne({
             where: { 
                username: req.body.username,
            } 
        });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        if(user.role !== 'admin' && user.role !== 'staff'){
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role, window: user.window },
            JWT_SECRET,
            { expiresIn: '24h' }    
        );
        res.json({ token: token, role: user.role });
    } 
    catch (err) {
        res.status(500).json({ error: err.errors.map(e => e.message) });
    }
};
//<!--===============================================================================================-->
exports.staffAuth = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token is required' });
    }
    if (blacklist.has(token)) {
        return res.status(403).json({ error: 'Token is blacklisted' });
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.role !== 'staff') {
            blacklist.add(token);
            return res.status(403).json({ error: 'Unauthorized' });
        }

        res.status(200).json({
            id: user.id,
            username: user.username,
            role: user.role,
            window: user.window,
            exp: decoded.exp, 
            iat: decoded.iat 
        });
    });
};
//<!--===============================================================================================-->
exports.adminAuth = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ error: 'Token is required'});
    }
    if (blacklist.has(token)) {
        return res.status(403).json({ error: 'Token is blacklisted'});
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.role !== 'admin') {
            blacklist.add(token);
            return res.status(403).json({ error: 'Unauthorized' });
        }
        res.status(200).json({
            id: user.id,
            username: user.username,
            role: user.role,
            exp: decoded.exp, 
            iat: decoded.iat 
        });
    });
};
//<!--===============================================================================================-->
exports.logout = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ error: 'Token is required'});
    }
    if(blacklist.has(token)){
        return res.status(403).json({ error: 'Token is blacklisted'});
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token'});
        }
        blacklist.add(token);
        return res.status(200).json({ message: 'Logged out successfully' });
    })
}
//<!--===============================================================================================-->
exports.redirect = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    if(token){
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if(err){
                return res.status(403).json({ error: 'Invalid or expired token'});
            }
            res.status(200).json({ role: decoded.role });
        })
    }
}
//<!--===============================================================================================-->
