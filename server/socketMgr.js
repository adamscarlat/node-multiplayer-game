var socketio = require('socket.io');
var Player = require('./models/player');
var EntityMediator = require('./entityMediator');

class SocketMgr {
    constructor(httpServer) {
        this.socketIO = socketio(httpServer);
        this.sockets = {};
    };

    init() {
        var self = this;
        this.entityMediator = new EntityMediator(this);
        this.socketIO.sockets.on('connection', function(socket) {
            self.connectionHandler.call(self, socket);
        });
        this.startUpdateInterval();
        console.log('socket io - now listening to incoming connections...')
    }

    connectionHandler(socket) {
        console.log('new connection: ' + socket.id)
        this.sockets[socket.id] = socket;
    
        this.entityMediator.createNewPlayer(socket);
        this.emitInitial();
    }

    startUpdateInterval() {
        var self = this;
        setInterval(function() {
            self.emitUpdates.call(self)
        }, 20)
    }

    removeSocket(socket) {
        console.log('removing socket: ', socket.id);
        delete this.sockets[socket.id];
    }

    emitUpdates() {
        var stateUpdate = this.entityMediator.getGameState();
        if (stateUpdate.length > 0) {
            this.emitToAllSockets('updates', stateUpdate);
        }
    }

    emitInitial() {
        var entities = this.entityMediator.getEntities();
        var currentState = [];
        for (let i in entities) {
            var entity = entities[i];
            currentState.push(entity.getCurrentState());
        }
        this.emitToAllSockets('init', currentState);
    }

    //TODO: must find a way to clean out the socket. The time is when the player is removed
    emitToAllSockets(channel, states) {
        for (let i in this.sockets) {
            var socket = this.sockets[i];
            socket.emit(channel, states);

            if (socket.toRemove) {
                socket.emit('gameover', {});
                delete this.sockets[socket.id];
            }
        }
    }
}

module.exports = SocketMgr;





