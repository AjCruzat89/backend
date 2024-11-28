//<!--===============================================================================================-->
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const PORT = 3000;
//<!--===============================================================================================-->
const app = express();
app.use(cors({
    origin: '*',
    methods: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//<!--===============================================================================================-->
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: '*',
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: false,
    }
});
app.use((req, res, next) => {
    req.io = io;
    next();
});
io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);

    socket.on('call', (msg, callback) => {
        io.emit('call', msg);
        callback({ status: 'success' });
    });
    
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
    });
});
//<!--===============================================================================================-->
app.use('/user', require('./routes/userRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/queue', require('./routes/queueRoutes'));
app.use('/staff', require('./routes/staffRoutes'));
// app.get('/test', (req, res) => {
//     res.send('TEST')
// })
//<!--===============================================================================================-->
const db = require('./models');
db.sequelize.authenticate()
    .then(() => {
        console.log('DB CONNECTED')
        server.listen(PORT, () => {
            console.log(`YOUR PORT IS: ${PORT}`)
        })
    })
    .catch((err) => {
        console.log('DB NOT CONNECTED')
        console.log(err)
    })
//<!--===============================================================================================-->
