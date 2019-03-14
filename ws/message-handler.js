const auth = require('../auth');

class MessageHandler {
    static onMessage(clients, client, data) {
        const args = JSON.parse(data);
        this._handleUnauthCommands(clients, client, args);

        // authentication needed for things below here
        const decrypt = auth.verify(args.token);

        // for any user
        if(decrypt) {
            this._handleUserCommands(clients, client, args);
            if (decrypt.role === 'Admin') {
                this._handleAdminCommands(clients, client, args);
            }
        }
    }

    static _handleUnauthCommands(clients, client, args) {
        switch(args.type) {
            case 'auth':
                if(client && client.authenticate(args.token)) {
                    clients.broadcastList();
                }
            break;
            case 'client_message':
                clients.find({id: args.target}).send({
                    sender: client.id,
                    msg: args.msg,
                    type: 'client_message'
                });
            break;
        }
    }

    static _handleUserCommands(clients, client, args) {
        switch(args.type) {
            case 'deauth':
                client.unauthenticate();
                clients.broadcastList();
            break;
        }
    }

    static _handleAdminCommands(clients, client, args) {
        switch(args.type) {
            case 'broadcast':
                clients.broadcast(
                    {
                        type: 'info', msg: args.msg
                    }
                );
            break;
            case 'redirect':
                clients.find({id: args.client}).send({
                    type: 'redirect',
                    target: args.target
                });
            break;
            case 'apply_class':
                clients.find({id: args.client}).send({
                    type: 'apply_class',
                    class: args.class,
                    apply: args.apply
                });
            break;
            case 'alert':
                clients.find({id: args.client}).send({
                    type: 'alert',
                    msg: args.msg
                });
            break;
        }
    }
}

module.exports = MessageHandler;