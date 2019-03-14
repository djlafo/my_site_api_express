const Client = require('./client');

class Clients {

    constructor() {
        this.clients = [];
        this.counter = 1;
    }

    add({ socket, ip }) {
        const client = new Client({
            counter: this.counter, 
            socket: socket,
            ip: ip,
            id: this.counter
        });
        client.send({
            type: 'info', 
            msg: 'Welcome to my website'
        });
        this.clients.push(client);
        this.counter++;
        this.broadcastList();
    }

    remove({ id, connection }) {
        const client = this.find({ id, connection });
        const ind = this.clients.indexOf(client);
        if(~ind) {
            this.clients.splice(ind, 1);
            this.broadcastList();
        }
    }

    find({ id, connection }) {
        return this.clients.find(client => {
            if(connection) {
                return client.socket === connection;
            } else {
                return client.id === Number(id);
            }
        });
    }

    broadcast(json, { adminsOnly, unauthOnly }) {
        this.clients.forEach(client => {
            if(adminsOnly) {
                if(client.admin) {
                    client.send(json);
                }  
            } else if(unauthOnly) {
                if(!client.admin) {
                    client.send(json);
                }
            } else {
                client.send(json);
            }
        });
    }

    broadcastList() {
        const list = this._getFormattedList({});
        this.clients.forEach(client => {
            if(!client.admin) return;
            const everyoneElse = list.filter(t => {
                return t.id !== client.id;
            });
            client.send({type: 'client_list', msg: everyoneElse});
        });
    }

    _getFormattedList() {
        return this.clients.map(client => {
            return {
                id: client.id,
                username: client.username,
                ip: client.ip,
                admin: (!!client.admin)
            };
        });
    }
}

module.exports = Clients;