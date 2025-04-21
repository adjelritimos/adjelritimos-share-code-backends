const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()
app.use(cors())
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: "*" } })

const sessions = {} // Armazena o estado das sessões

io.on('connection', (socket) => {
    console.log('Um usuário conectado:', socket.id)

    // Quando um usuário entra em uma sala
    socket.on('join-session', (sessionId) => {
        socket.join(sessionId)
        if (!sessions[sessionId]) {
            sessions[sessionId] = '' // Inicializa a sessão
        }
        socket.emit('code-update', sessions[sessionId]) // Envia o código atual
    })

    // Quando o código é editado
    socket.on('code-change', ({ sessionId, code }) => {
        sessions[sessionId] = code // Atualiza o estado da sessão
        socket.to(sessionId).emit('code-update', code) // Notifica outros usuários
    })

    // Quando um usuário desconecta
    socket.on('disconnect', () => {
        console.log('Usuário desconectado:', socket.id)
    })
})

server.listen(5000, () => {
    console.log('Servidor rodando na porta 5000')
})