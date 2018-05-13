
var SOCKET;
var ENTITIES = {};
var SELF_PLAYER;

var CANVAS = document.getElementById('ctx').getContext("2d");
var CANVAS_HEIGHT = CANVAS.canvas.height;
var CANVAS_WIDTH= CANVAS.canvas.width;

var startButton = document.getElementById('start');
CANVAS.font = '30px Arial';

var mapImage = new Image();
mapImage.src = '../img/map.png';


function main() {
    startButton.hidden = true;
    SOCKET = io();
    registerPlayerEvents(SOCKET);
    SOCKET.on('updates', function(currentState) {
        console.log('received new updates: ', currentState);
        //loop over data.updates
            //1. get incoming state update list.
            //2. state is removed - remove from entities
            //continue loop
    
            //3. get entity id - if not in entities use factory to create it and add it.
            //4. get entity from entities by id - pass it the state args for updating
        //end-loop
        
        //5. once all entities are updated, call draw on each one
        for (let i in currentState) {
            var entityState = currentState[i];
            if (entityState.removed) {
                handleRemovedState(entityState);
                continue;
            }
    
            if (!ENTITIES[entityState.id]) {
                ENTITIES[entityState.id] = entityFactory.createNewEntity(entityState.type, entityState);
            } else {
                ENTITIES[entityState.id].updateState(entityState);
            }
        }
        render();
        
    });

    SOCKET.on('initSelf', function(data) {
        console.log(data);
        console.log(socket.id);
    })
    
    SOCKET.on('init', function(currentState) {
        console.log(currentState);
    
        //1. use factory to create entities according to type. store each entity in entities
        //1a. ignore removed entities
    
        //2. when all entities are ready - call draw on each one.
        for (var i in currentState) {
            var entityState = currentState[i];
            if (entityState.removed) continue;
    
            var type = entityState.type;
            var entity = entityFactory.createNewEntity(type, entityState);

            //identify self player and store it
            if (entity.socketId && entity.socketId === SOCKET.id) {
                SELF_PLAYER = entity;
            }
    
            ENTITIES[entity.id] = entity;
        }
        render();
        
        //TODO: this is a workaround for the player image not drawing when pressing start.
        //It only draws after first update event... Why?
        SOCKET.emit('keyPress', {input: 'up', state: false});
    });

    SOCKET.on('gameover', function(data) {
        startButton.hidden = false;
        ENTITIES = {};
        CANVAS.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    })
}

function handleRemovedState(entityState) {
    delete ENTITIES[entityState.id];
}

function render() {
    CANVAS.clearRect(0, 0, CANVAS_WIDTH, CANVAS_WIDTH);
    drawMap();
    for (let entityId in ENTITIES) {
        let entity = ENTITIES[entityId];
        entity.draw();
    }
    SELF_PLAYER.drawSelfData();
}

function drawMap() {
    // var x = CANVAS_WIDTH / 2 - SELF_PLAYER.x;
    // var y = CANVAS_HEIGHT / 2 - SELF_PLAYER.y;
    CANVAS.drawImage(mapImage, 0, 0);
}

function registerPlayerEvents(socket) {
    var self = this;
    document.onkeydown = function(event) {
        if (event.keyCode === 68) { //d
            socket.emit('keyPress', {input: 'right', state: true});
        }
        else if (event.keyCode === 83) { //s
            socket.emit('keyPress', {input: 'down', state: true});
        }
        else if (event.keyCode === 65) { //a
            socket.emit('keyPress', {input: 'left', state: true});
        }
        else if (event.keyCode === 87) { //w
            socket.emit('keyPress', {input: 'up', state: true});
        }
    }
    
    document.onkeyup = function(event) {
        if (event.keyCode === 68) { //d
            socket.emit('keyPress', {input: 'right', state: false});
        }
        else if (event.keyCode === 83) { //s
            socket.emit('keyPress', {input: 'down', state: false});
        }
        else if (event.keyCode === 65) { //a
            socket.emit('keyPress', {input: 'left', state: false});
        }
        else if (event.keyCode === 87) { //w
            socket.emit('keyPress', {input: 'up', state: false});
        }
    }

    document.onmousedown = function(event) {
        socket.emit('keyPress', {
            input: 'shoot', 
            state: true,
            clickCoords: {
                clickX: event.clientX,
                clickY: event.clientY
            }   
        });
    }

    document.onmouseup = function(event) {
        socket.emit('keyPress', {
            input: 'shoot', 
            state: false,
            clickCoords: {
                clickX: event.clientX,
                clickY: event.clientY
            }   
        });
    }

}

// function getMouseAngle(event) {
//     var x = -400 + event.clientX - 8;
//     var y = -400 + event.clientY - 8;
//     var angle = (Math.atan2(y,x) / Math.PI) * 180;

//     return angle;
// }