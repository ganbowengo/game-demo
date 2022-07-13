/*
 * @Author       : ganbowen
 * @Date         : 2022-07-13 14:29:02
 * @LastEditors  : ganbowen
 * @LastEditTime : 2022-07-13 23:58:14
 * @Descripttion : 
 */
const express = require('express')
const socketIo = require('socket.io')
const http = require('http')
const PORT = process.env.PORT || 5000
const app = express()
const router = express.Router()

let rooms = {}
const clients = []
const gamesResult = {}

router.get('/rooms', function (req, res) {
    res.send(rooms);
})

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.use('/', router);
const server = http.createServer(app)

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

io.on('connection', (socket) => {
    clients.push(socket)
    socket.on('createRoom', (e) => {
        socket.join(e);
        rooms[e] = { id: e, count: 0 }
        roomUpdate()
    })
    
    socket.on('joinRoom', (e) => {
        if(!rooms[e]) return
        if(rooms[e].count >= 2) {
            socket.emit('roomLimit', e)
        } else {
            rooms[e].count++
            socket.join(e);
            roomUpdate()
        }
    })

    socket.on('leaveRoom', (e) => {
        if(!rooms[e]) return
        rooms[e].count--
        socket.leave(e);
        roomUpdate()
    })

    socket.on('startGameServer', (e) => {
        gamesResult[e] ? gamesResult[e].push(getGameResult()) : (gamesResult[e] = [getGameResult()])
        clients.forEach(s => {
            let message = ''
            let otherMessage = ''
            const result = gamesResult[e][0] - gamesResult[e][1]
            if(gamesResult[e].length === 2) {
                if(result === 0) {
                    otherMessage =message = '打平了'
                } else if (result === 1 || result === -2) {
                    message = '大神，你赢了'
                    otherMessage =  '你输了，再接再厉'
                } else {
                    message = '你输了，再接再厉'
                    otherMessage = '大神，你赢了'
                }
            }
            if(s === socket) {
                socket.in(e).emit('gameServerResult', JSON.stringify([...gamesResult[e], message]))
            } else {
                s.in(e).emit('gameServerResult', JSON.stringify([...gamesResult[e], otherMessage]))
            }
        })
        if(gamesResult[e].length === 2) delete gamesResult[e]
    })

    socket.on('disconnect', (reason) => {
        rooms = {}
    })
})

const gameRules = [1,2,3]

function getGameResult () {
    return gameRules[Math.floor(Math.random() * 3)]
}

function roomUpdate () {
    clients.forEach(socket => socket.emit('roomUpdate'))
}

server.listen(PORT, err => {
    if (err) console.log(err)
    console.log('Server running on Port ', PORT)
})