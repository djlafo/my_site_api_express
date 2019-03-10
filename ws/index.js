const router = require('express').Router();
const auth = require('../auth');
const WebSocket = require('ws');
let WSS = null;
let users = [];
let admins = [];

router.ws('/', (ws, req) => {
    send(ws, {type: 'info', msg: 'Welcome to my website'});
    broadcastClientList();
    ws.on('message', (data) => {
        const toJson = JSON.parse(data);
        switch(toJson.type) {
            case 'auth':
                const verify = auth.verify(toJson.token);
                if(verify) {
                    if(verify.role === 'Admin') {
                        admins.push({
                            client: ws,
                            username: verify.username
                        });
                    } else {
                        users.push({
                            client: ws,
                            username: verify.username
                        });
                    }
                    broadcastClientList();
                }
            break;
            case 'client_message':
                send(getTargetWs(toJson.target), {
                    sender: getSenderId(ws),
                    msg: toJson.msg,
                    type: 'client_message'
                });
            break;
        }
        // authentication needed for things below here
        const decrypt = auth.verify(toJson.token);
        // for any user
        if(decrypt) {
            switch(toJson.type) {
                case 'deauth':
                    deauth(ws);
                break;
            }
            if (decrypt.role === 'Admin') {
                if(!auth.verify(toJson.token)) return;
                switch(toJson.type) {
                    case 'broadcast':
                        broadcast({type: 'info', msg: toJson.msg});
                    break;
                }
            }
        }
    });
    ws.on('close', () => {
        deauth(ws);
    });
});

function getSenderId(ws) {
    const adminSearch = admins.find(admin => ws === admin.client);
    if(adminSearch) return adminSearch.username;
    const userSearch = users.find(user => ws === user.client);
    if(userSearch) return userSearch.username;

    let i = 0;
    let found;
    WSS.clients.forEach(client => {
        if(client === ws) {
            found = i;
            return;
        }
        i++;
    });
    if(found) return found;
}

function getTargetWs(id) {
    const adminSearch = admins.find(admin => id === admin.username);
    if(adminSearch) return adminSearch.client;
    const userSearch = users.find(user => id === user.username);
    if(userSearch) return userSearch.client;

    return Array.from(WSS.clients)[parseInt(id, 10)];
}

function deauth(ws) {
    let ind = admins.findIndex(admin => admin.client === ws);
    if(~ind) {
        admins.splice(ind, 1);
    }
    ind = users.findIndex(user => user.client === ws);
    if(~ind) {
        users.splice(ind, 1);
    }
    broadcastClientList({});
}

function send(ws, json) {
    if(ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(json));
    }
}

function broadcast(json, { adminsOnly, unauthOnly }) {
    if(adminsOnly) {
        admins.forEach(admin => {
            send(admin.client, json);
        });
    } else if (unauthOnly) {
        WSS.clients.forEach(client => {
            const admin = admins.find(admin => admin.client === client);
            if(!admin) {
                send(client, json);
            }
        });
    } else {
        WSS.clients.forEach(client => {
            send(client, json);
        });
    }
}

// function sendClientList(ws) {
//     send(ws, {type: 'client_list', msg: getClientList()});
// }

function broadcastClientList() {
    broadcast({type: 'client_list', msg: getClientList({ admin: true })}, {adminsOnly: true});
    broadcast({type: 'client_list', msg: getClientList({})}, {unauthOnly: true});
}

function getClientList({ admin = false}) {
    if(admin) {
        let clients = [];
        let i = 0;
        WSS.clients.forEach(client => {
            const admin = admins.find(admin=> {
                return admin.client === client;
            });
            const user = users.find(user=> {
                return user.client === client;
            });
            clients.push({
                id: i,
                ip: client._socket.remoteAddress,
                username: (admin && admin.username || user && user.username),
                admin: (!!admin)
            });
            i++;
        });
        return clients;
    } else {
        return admins.map(admin => {
            return {
                username: admin.username
            };
        });
    }
}

module.exports = (ws) => {
    WSS = ws;
    return {router: router, WSS: WSS, broadcast: broadcast, send: send};
};