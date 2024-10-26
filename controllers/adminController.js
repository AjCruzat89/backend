//<!--===============================================================================================-->
const { Op, fn, col, literal, where } = require("sequelize");
const db = require('../models');
const { User, Window, ProcessType, Transaction } = db;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'capstone_jwt';
const blacklist = require('./blacklist');
//<!--===============================================================================================-->
exports.ensureAdmin = async (req, res, next) => {
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
        if (user.role !== 'admin') {
            blacklist.add(token);
            return res.status(403).json({ error: 'Unauthorized access' });
        }
        next();
    });
}
exports.adminStats = async (req, res) => {
    try{
        const userCount = await User.count({
            where: {
                role: {
                    [Op.ne]: 'admin' 
                }
            }
        });
        const windowCount = await Window.count();
        return res.status(200).json({ userCount, windowCount });    
    }
    catch(err){
        res.status(500).json({ error: err });
    }
}
//<!--===============================================================================================-->
exports.createWindow = async (req, res) => {
    try {
        const newWindow = await Window.create(req.body);
        res.status(200).json({ message: 'Window created successfully', newWindow });
    }
    catch (err) {
        res.status(500).json({ error: err.errors.map(e => e.message) });
    }
}
//<!--===============================================================================================-->
exports.editWindow = async (req, res) => {
    try {
        const window = await Window.findOne({
            where: {
                id: req.body.id
            }
        });
        if (!window) {
            return res.status(404).json({ error: 'Window not found' });
        }
        const updatedWindow = await window.update(req.body);
        req.io.emit('refreshDatas');
        req.io.emit('refreshQueue');
        res.status(200).json({ message: 'Window updated successfully', updatedWindow });
    }
    catch (err) {
        if (err.errors) {
            res.status(500).json({ error: err.errors.map(e => e.message) });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
}
//<!--===============================================================================================-->
exports.deleteWindow = async (req, res) => {
    const window = await Window.findOne({
        where: {
            id: req.body.id
        }
    });
    if (!window) {
        return res.status(404).json({ error: 'Window not found' });
    }
    await window.destroy();
    req.io.emit('refreshDatas');
    res.status(200).json({ message: 'Window deleted successfully' });
}
//<!--===============================================================================================-->
exports.getWindows = async (req, res) => {
    try {
        const windows = await Window.findAll();
        res.status(200).json({ windows });
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
}
//<!--===============================================================================================-->
exports.getProcessTypes = async (req, res) => {
    try{
        const processTypes = await ProcessType.findAll({
            include: [{
                model: Window,
                attributes: []
            }],
            where: {
                window: req.params.window
            }
        });
        res.status(200).json({ processTypes });
    }
    catch(err){
        res.status(500).json({ error: err });
    }
}
//<!--===============================================================================================-->
exports.createProcessType = async (req, res) => {
    try{ 
        const newProcessType = await ProcessType.create(req.body);
        req.io.emit('refreshDatas');
        res.status(200).json({ message: 'Process type created successfully', newProcessType });
    }
    catch(err){
        if (err.errors) {
            res.status(500).json({ error: err.errors.map(e => e.message) });
        } else {
            res.status(500).json({ error: err });
        }
    }
}
//<!--===============================================================================================-->
exports.editProcessType = async (req, res) => {
    try {
        const processType = await ProcessType.findOne({
            where: {
                id: req.body.id
            }
        });
        if (!processType) {
            return res.status(404).json({ error: 'Process type not found' });
        }
        const updatedProcessType = await processType.update(req.body);
        req.io.emit('refreshDatas');
        res.status(200).json({ message: 'Process type updated successfully', updatedProcessType });
    }
    catch (err) {
        if (err.errors) {
            res.status(500).json({ error: err.errors.map(e => e.message) });
        } else {
            res.status(500).json({ error: err });
        }
    }
}
//<!--===============================================================================================-->x
exports.deleteProcessType = async (req, res) => {
    const processType = await ProcessType.findOne({
        where: {
            id: req.body.id
        }
    });
    if (!processType) {
        return res.status(404).json({ error: 'Process type not found' });
    }
    await processType.destroy();
    req.io.emit('refreshDatas');
    res.status(200).json({ message: 'Process type deleted successfully' });
}
//<!--===============================================================================================-->x
exports.getUsers = async (req, res) => {
    try{
        const users = await User.findAll({
            where: {
                role: {
                    [Op.ne]: ['admin']
                }
            }
        });
        res.status(200).json({ users });
    }
    catch(err){
        res.status(500).json({ error: err });
    }
}
//<!--===============================================================================================-->x
exports.createUser = async (req, res) => {
    try{
        const newUser = await User.create(req.body);
        res.status(200).json({ message: 'User created successfully', newUser });
    }
    catch(err){
        if (err.errors) {
            res.status(500).json({ error: err.errors.map(e => e.message) });
        } else {
            res.status(500).json({ error: err });
        }
    }
}
//<!--===============================================================================================-->x
exports.editUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                id: req.body.id
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const updatedUser = await user.update(req.body);
        res.status(200).json({ message: 'User updated successfully', updatedUser });
    }
    catch (err) {
        if (err.errors) {
            res.status(500).json({ error: err.errors.map(e => e.message) });
        } else {
            res.status(500).json({ error: err });
        }
    }
}
//<!--===============================================================================================-->x
exports.deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            id: req.body.id
        }
    });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
}
//<!--===============================================================================================-->x
exports.getWindowNames = async (req, res) => {
    try{
        const windows = await Window.findAll({
            attributes: ['window']
        });
        res.status(200).json({ windows });
    }
    catch(err){
        res.status(500).json({ error: err });
    }
}
//<!--===============================================================================================-->x
exports.getTransactions = async (req, res) => {
    try{
        const results= await Transaction.findAll();
        res.status(200).json({ results });
    }
    catch(err){
        res.status(500).json({ error: err });
    }
}
//<!--===============================================================================================-->x