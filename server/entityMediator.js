var Player = require('./models/player')

/*
EntityMeidator mediates actions between entities. It has knowledge
of all the entities that are currently in the game. It works with the
SocketMgr when a new gameState is needed.
*/
class EntityMediator {
    constructor(socketMgr) {
        this.entities = {};
        this.currentEntityId = 0;
        this.initialX = 400;
        this.initialY = 400;
        this.socketMgr = socketMgr;
        this.stateUpdatesQueue = [];
        this.collisionRadius = 20;
    }

    /*
    Create a new Player entity. This happens upon new connection event. 
    */
    createNewPlayer(socket) {
        var player =  new Player(this, socket, this.initialX, this.initialY);
        this.addEntity(player);

        console.log('new player: ' + player.id);

        return player;
    }

    /*
    Get all the entities that are currently in the game.
    */
    getEntities() {
        return this.entities;
    }

    /*
    Add a new entity to the game.
    */
    addEntity(entity) {
        if (!entity.id) {
            console.error('cannot add an entity without an id')
        }
        if (this.entities[entity.id]) {
            console.error('entity with id ' + entity.id + ' already exists')
        }
        this.entities[entity.id] = entity;
    }

    /*
    Remove an entity from the game.

    //TODO: if a player is removed, should its socket be also removed?
    */
    removeEntity(entity) {
        var removedState = entity.getCurrentState();
        entity.addState(removedState);
    }

    /*
    Check collision with other entities. According to entityFrom's currentState, the mediator
    will check if any other entity collides with it. This method is called on demand (see Bullet for
    an exampl).
    */
    checkCollisions(entityFrom) {
        for (let entityId in this.entities) {
            if (entityId === entityFrom.id) continue;
    
            let entityTo = this.entities[entityId];
            let distance = this.getDistance(entityFrom, entityTo);
            if (distance <= this.collisionRadius && entityTo.id !== entityFrom.parent.id && entityTo.type !== entityFrom.type) {
                entityFrom.handleCollision(entityTo);
                return true;
            }
        }
        return false;
    }

    /*
    Get the euclidean distance between entityFrom to entityTo
    */
    getDistance(entityFrom, entityTo) {
        return Math.sqrt(Math.pow(entityFrom.x - entityTo.x, 2) + Math.pow(entityFrom.y - entityTo.y, 2));
    }


    /*
    Iterate over all the entities in the game and from each one, dequeue a state. Collect all 
    of these states and return them to the caller. 
    If an entity's state is removed, delete it. 
    */
    getGameState() {
        var gameState = []
        for (let i in this.entities) {
            var entity = this.entities[i];
            if (!entity.hasStateUpdates()) continue;

            var currentState = entity.dequeueState();
            if (currentState.removed) {
                this.handleRemovedState(currentState)
            }
            
            gameState.push(currentState);
        }
        return gameState;
    }

    handleRemovedState(currentState) {
        if (currentState.type === 'player') {
           this.setRemoveSocket(currentState.id)
        }
        delete this.entities[currentState.id]
    }

    setRemoveSocket(playerEntityId) {
        var playerEntity = this.entities[playerEntityId];
        if (playerEntity) {
            playerEntity.socket.toRemove = true;
        }
    }
}

module.exports = EntityMediator;