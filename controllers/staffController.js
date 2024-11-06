//<!--===============================================================================================-->
const { Op, fn, col, literal, where } = require("sequelize");
const db = require('../models');
const { User, Window, ProcessType, Queue, Transaction } = db;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'capstone_jwt';
const blacklist = require('./blacklist');
//<!--===============================================================================================-->
exports.ensureStaff = async (req, res, next) => {
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
            return res.status(403).json({ error: 'Unauthorized access' });
        }

        req.staffWindow = user.window;
        next();
    });
}
//<!--===============================================================================================-->
exports.currentWindow = async (req, res) => {
    try {
        const result = await Queue.findOne({
            where: {
                window: req.staffWindow,
                status: 'pending',
                [Op.and]: [
                    literal("DATE(CONVERT_TZ(createdAt, '+00:00', '+08:00')) = CURDATE()")
                ]
            },
            order: [['updatedAt', 'ASC']]
        });
        return res.status(200).json({ result });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
//<!--===============================================================================================-->
exports.getWindowNames = async (req, res) => {
    try{
        const windows = await Window.findAll({
            attributes: ['window'],
            where: { 
                status: 'open',
                window: {
                    [Op.ne]: req.staffWindow
                }
             },
        });
        res.status(200).json({ windows });
    }
    catch(err){
        res.status(500).json({ error: err });
    }
}
//<!--===============================================================================================-->
exports.updateQueue = async (req, res) => {
    try{
        const result = await Queue.findByPk(req.body.id);
        result.window = req.staffWindow;
        await result.save();
        req.io.emit('refreshQueue');
        res.status(200).json({ result });
    }
    catch(err){
        res.status(500).json({ error: err });
    }
}
//<!--===============================================================================================-->
exports.transferWindow = async (req, res) => {
    try{
        const result = await Queue.findByPk(req.body.id);
        result.window = req.body.window.length > 0 ? req.body.window : null;
        await result.save();
        req.io.emit('refreshQueue');
        res.status(200).json({ result });
    }
    catch(err){
        res.status(500).json({ error: err });
    }
}
//<!--===============================================================================================-->
exports.finishQueue = async (req, res) => {
    try{
        const result = await Queue.findByPk(req.body.id);
        result.status = 'finished';
        await result.save();
        req.io.emit('refreshQueue');
        res.status(200).json({ result });
    }
    catch(err){
        res.status(500).json({ error: err });
    }
}
//<!--===============================================================================================-->
exports.getPending = async (req, res) => {
    try {
        const windowStatus = await Window.findOne({
            where: {
                window: req.staffWindow
            },
            attributes: ['status']
        })

        if (windowStatus.dataValues.status !== 'open') {
            return res.status(400).json({ error: 'Window is not open' });
        }

        const results = await Queue.findAll({
            where: {
                [Op.and]: [
                    literal('DATE(`Queue`.`createdAt`) = CURDATE()'),
                    { status: 'pending' },
                    {
                        window: {
                            [Op.is]: null 
                        }
                    }
                ]
            },
            order: [['updatedAt', 'ASC']]
        });
        return res.status(200).json({ results });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//<!--===============================================================================================-->
exports.getTransactionsById = async (req, res) => {
    try {
        const results = await Transaction.findAll({
            include: [{
                model: Queue,
                attributes: []
            }],
            where: {
                [Op.and]: [
                    {
                        transaction_id: req.params.id
                    }
                ]
            }
        });
        return res.status(200).json({ results });
    }
    catch(err) {
        res.status(500).json({ error: err });
    }
}
//<!--===============================================================================================-->
exports.addTransaction = async (req, res) => {
    try{
        const result = await Transaction.create({
            transaction_id : req.body.id,
            amount: req.body.amount,
            description: req.body.description
        });
        req.io.emit('refreshQueue');
        res.status(200).json({ result });
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
exports.deleteTransaction = async (req, res) => {
    try{
        const result = await Transaction.destroy({
            where: {
                id : req.body.id
            }
        });
        req.io.emit('refreshQueue');
        res.status(200).json({ result });
    }
    catch(err){
        res.status(500).json({ error: err });
    }
}
//<!--===============================================================================================-->