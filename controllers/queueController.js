//<!--===============================================================================================-->
const { Op, fn, col, literal, where } = require("sequelize");
const db = require('../models');
const { User, Window, ProcessType, Queue } = db;
//<!--===============================================================================================-->
exports.getProcesses = async (req, res) => {
    try{
        const processes = await ProcessType.findAll({
            include: [
                {
                    model: Window,
                    where: { status: 'open' },
                    required: true,
                    attributes: []
                }
            ],
        });
        res.status(200).json({ processes });
    }
    catch(err){
        res.status(500).json({ error: err });
    }
}
//<!--===============================================================================================-->
exports.getProcess = async (req, res) => {
    try{
        const process = await ProcessType.findOne({
            where: { coding: req.params.process_type },
            include: [
                {
                    model: Window,
                    where: { status: 'open' },
                    required: true,
                    attributes: []
                }
            ],
        });
        res.status(200).json({ process });
    }
    catch(err){
        res.status(500).json({ error: err });
    }
}
//<!--===============================================================================================-->
exports.getLastNumber = async (req, res) => {
    
    const queue_number = req.query.queue_number;
    queue_number_length = queue_number.length + 1

    try {
        const result = await Queue.findOne({
            attributes: [
                [fn('IFNULL', fn('MAX', literal(`CAST(SUBSTRING(queue_number, ${queue_number_length}) AS UNSIGNED)`)), 0), 'lastNumber']
            ],
            where: {
                [Op.and]: [
                    literal('DATE(createdAt) = CURDATE()'),
                    { queue_number: { [Op.like]: `${queue_number}%` } }
                ]
            }
        });
        return res.status(200).json({ lastNumber: result.dataValues.lastNumber });
    } 
    catch(err) {
        res.status(500).json({ error: err.message });
    }
}
//<!--===============================================================================================-->
exports.createQueueNumber = async (req, res) => {
    try{
        const existingQueueToday = await Queue.findOne({
            where: {
                [Op.and]: [
                    literal('DATE(createdAt) = CURDATE()'),
                    { queue_number: { [Op.like]: `${req.body.queue_number}%` } }
                ]
            }
        })
        if (existingQueueToday){
            return res.status(400).json({ error: 'Queue number already exists' });
        }
        const result = await Queue.create({
            queue_number: req.body.queue_number,
            process: req.body.process,
        })
        req.io.emit('refreshQueue');
        return res.status(200).json({ result });
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}
//<!--===============================================================================================-->
exports.getPending = async (req, res) => {
    try {
        const results = await Queue.findAll({
            where: {
                [Op.and]: [
                    literal('DATE(createdAt) = CURDATE()'),
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
exports.getQueues = async (req, res) => {
    try {
        const results = await Queue.findAll({
            where: {
                [Op.and]: [
                    literal('DATE(createdAt) = CURDATE()'),
                    { status: 'pending' },
                    {
                        window: {
                            [Op.ne]: null
                        }
                    }
                ]
            },
            order: [['updatedAt', 'ASC']]
        });

        return res.status(200).json({ results });
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
};
//<!--===============================================================================================-->