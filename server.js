const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', 
        methods: ['GET', 'POST'],
    },
});

const presentations = {};

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', (presentationId) => {
        socket.join(presentationId);
        console.log(`User ${socket.id} joined room ${presentationId}`);

        if (!presentations[presentationId]) {
        presentations[presentationId] = {
            slides: [{ id: Date.now(), elements: [] }],
            users: [],
        };
        }

        const name = `User-${socket.id.slice(0, 4)}`;
        presentations[presentationId].users.push({
        id: socket.id,
        name,
        role: 'editor',
        });

        io.to(presentationId).emit('updateSlides', presentations[presentationId].slides);
        io.to(presentationId).emit('usersUpdate', presentations[presentationId].users);

        socket.on('updateSlides', ({ id, slides }) => {
        presentations[id].slides = slides;
        io.to(id).emit('updateSlides', slides);
        });

        socket.on('changeUserRole', ({ presentationId, userId, newRole }) => {
        const user = presentations[presentationId].users.find((u) => u.id === userId);
        if (user) {
            user.role = newRole;
            io.to(presentationId).emit('usersUpdate', presentations[presentationId].users);
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

server.listen(3001, () => {
    console.log('Socket server running on http://localhost:3001');
});