const router = require('express').Router();

const MessageHandler = require('./message-handler');
const Clients = require('./clients');

let WSS = null;
const clients = new Clients();

router.ws('/', (ws, req) => {
    clients.add({
        socket: ws,
        ip: req.connection.remoteAddress
    });
    ws.on('message', (data) => {
        MessageHandler.onMessage(clients, clients.find({connection: ws}), data)
    });
    ws.on('close', () => {
        clients.remove({connection: ws});
    });
});

module.exports = (ws) => {
    WSS = ws;
    return {router: router, WSS: WSS, Clients: Clients};
};