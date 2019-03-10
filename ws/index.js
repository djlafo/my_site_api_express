const router = require('express').Router();
const auth = require('../auth');
const WebSocket = require('ws');
let WSS = null;
let users = [];
let idCounter = 1;

router.ws('/', (ws, req) => {
    send(ws, {type: 'info', msg: 'Welcome to my website'});
    users.push({
        id: idCounter,
        client: ws,
        ip: req.connection.remoteAddress
    });
    idCounter++;
    broadcastClientList();
    ws.on('message', (data) => {
        const toJson = JSON.parse(data);
        switch(toJson.type) {
            case 'auth':
                const verify = auth.verify(toJson.token);
                if(verify) {
                    const user = findUser(ws);
                    if(user) {
                        user.username = verify.username;
                        user.admin = verify.role === 'Admin';
                        broadcastClientList();
                    }
                }
            break;
            case 'client_message':
                send(getTargetWs(toJson.target), {
                    sender: findUser(ws).id,
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
                    case 'redirect':
                        send(getTargetWs(toJson.client), {
                            type: 'redirect',
                            target: toJson.target
                        });
                    break;
                    case 'apply_class':
                        send(getTargetWs(toJson.client), {
                            type: 'apply_class',
                            class: toJson.class,
                            apply: toJson.apply
                        });
                    break;
                    case 'alert':
                        send(getTargetWs(toJson.client), {
                            type: 'alert',
                            msg: toJson.msg
                        });
                    break;
                }
            }
        }
    });
    ws.on('close', () => {
        remove(ws);
    });
});

function findUser(ws) {
    return users.find(user => {
        return user.client === ws;
    });
}

function getTargetWs(id) {
    const foundUser = users.find(user => {
        return user.id === Number(id);
    });
    if(foundUser) return foundUser.client;
}

function remove(ws) {
    let ind = users.findIndex(user => user.client === ws);
    if(~ind) {
        users.splice(ind, 1);
        broadcastClientList();
    }
}

function deauth(ws) {
    let user = users.find(user => user.client === ws);
    if(user) {
        user.username = null;
        user.admin = false;
    }
    broadcastClientList();
}

function send(ws, json) {
    if(ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(json));
    }
}

function broadcast(json, { adminsOnly, unauthOnly }) {
    users.forEach(user => {
        if(adminsOnly && user.admin || unauthOnly && !user.admin || (!adminsOnly && !unauthOnly)) {
            send(user.client, json);
        }
    });
}

// function sendClientList(ws) {
//     send(ws, {type: 'client_list', msg: getClientList()});
// }

function broadcastClientList() {
    let adminList = getClientList({ admin: true });
    let otherList = getClientList({});
    users.forEach(user => {
        let targetList = !!user.admin ? adminList : otherList;
        targetList = targetList.filter(t => {
            return t.id !== user.id;
        });
        send(user.client, {type: 'client_list', msg: targetList});
    });
}

function getClientList({ admin = false}) {
    let clients = [];
    users.forEach(user => {
        if(!user.admin && admin || user.admin) {
            clients.push({
                id: user.id,
                username: user.username,
                ip: admin && user.ip,
                admin: (!!user.admin)
            });
        }
    });
    return clients;
}

module.exports = (ws) => {
    WSS = ws;
    return {router: router, WSS: WSS, broadcast: broadcast, send: send};
};