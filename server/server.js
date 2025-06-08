const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['https://deckly.onrender.com'],
        methods: ['GET', 'POST'],
    },
});

const presentations = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('createRoom', (nickname) => {
        const id = Math.random().toString(36).substring(2, 8);
        presentations[id] = {
            slides: [{ id: Date.now(), elements: [] }],
            users: [],
            ownerName: nickname,
            ownerSocketId: socket.id
        };
        socket.emit('roomCreated', id);
    });

    socket.on('join', (presentationId, nickname) => {
        if (!presentations[presentationId]) {
            socket.emit('roomNotFound');
            return;
        }

        socket.join(presentationId);
        socket.emit('usersUpdate', presentations[presentationId].users);
        console.log(`User ${socket.id} joined room ${presentationId}`);

        presentations[presentationId].users = presentations[presentationId].users.filter(u => u.id !== socket.id);

        const role = 'creator';

        presentations[presentationId].users.push({
            id: socket.id,
            name: nickname,
            role,
        });

        io.to(presentationId).emit('updateSlides', presentations[presentationId].slides);
        io.to(presentationId).emit('usersUpdate', presentations[presentationId].users);

        socket.on('updateSlides', ({ id, slides }) => {
            presentations[id].slides = slides;
            io.to(id).emit('updateSlides', slides);
        });

        socket.on('changeUserRole', ({ presentationId, userId, newRole }) => {
            const room = presentations[presentationId];
            if (!room) return;

            const changer = room.users.find(u => u.id === socket.id);

            const creator = room.users.find(u => u.role === 'creator');
            if (!changer || changer.id !== creator?.id) return;

            const user = room.users.find(u => u.id === userId);

            if (user) {
                if (user.id === room.users.find(u => u.role === 'creator')?.id) {
                    return;
                }
                user.role = newRole;
                io.to(presentationId).emit('usersUpdate', room.users);
            }
        });

        socket.on('disconnect', () => {
            for (const [id, room] of Object.entries(presentations)) {
                room.users = room.users.filter((u) => u.id !== socket.id);
                io.to(id).emit('usersUpdate', room.users);
            }
        });
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Socket server running on port ${PORT}`);
});