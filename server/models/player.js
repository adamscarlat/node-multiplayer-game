var Entity = require('./entity')
var Bullet = require('./bullet');

/*
Player represents a human player who's connected to the game. For that reason,
unlike other entities, it has a socket and can listen to keyPress events. 
*/
class Player extends Entity {
    constructor(mediator, socket, x, y) {
        super(mediator, x, y);
        this.socket = socket;

        this.hp = 10;
        this.maxHp = 10;
        this.score = 0;
        this.maxSpeed = 10;
        this.removed = false;
        this.type = 'player';

        this.initMovements();
        this.registerPlayerCallbacks(socket);
    }

    /*
    Initialize keyPress movements. These will change upon keyPress events.
    */
    initMovements() {
        this.pressingRight = false;
        this.pressingLeft = false;
        this.pressingUp = false;
        this.pressingDown = false;
        this.shooting = false;
    }

    /*
    Register socket event callbacks that the player responds to.
    */
    registerPlayerCallbacks(socket) {
        var self = this;
        socket.on('disconnect', function() {
            self.removeSelf.call(self);
        });
        socket.on('keyPress', function(data) {
            self.onKeyPressHandler.call(self, data)
        })
    }

    //TODO: move common properties to a base class method and only append the specific 
    //ones here.
    /*
    Returns current state for this entity.
    */
    getCurrentState() {
        return {
            removed: this.removed,
            id: this.id,
            type: this.type,
            x: this.x,
            y: this.y,
            hp: this.hp,
            maxHp: this.maxHp,
            score: this.score,
            socketId: this.socket.id
        }
    }

    /*
    Shoot event. Player entity creates a Bullet in an engle relative to itself and 
    the click event x,y coordinates.
    */
    shoot(clickCoords) {
        if (!clickCoords || !clickCoords.clickX || !clickCoords.clickY) return;

        var angle = this.getAngle(clickCoords);
        var bullet = new Bullet(this.mediator, this.x, this.y, angle, this);
        this.mediator.addEntity(bullet);
    }

    /*
    Get an angle for the click event. This angle is relative to the click event
    and the player's position.
    */
    getAngle(clickCoords) {
        var x = -this.x + clickCoords.clickX - 8;
        var y = -this.y + clickCoords.clickY - 8;
        var angle = Math.atan2(y, x)  / Math.PI * 180;
        return angle;
    }

    /*
    Handler for keyPress event. 
    */
    onKeyPressHandler(data) {        
        if (data.input === 'right') this.pressingRight = data.state;
        if (data.input === 'left') this.pressingLeft = data.state;
        if (data.input === 'up') this.pressingUp = data.state;
        if (data.input === 'down') this.pressingDown = data.state;
        if (data.input === 'shoot') this.shooting = data.state;
        if (data.input === 'mouseAngle') this.mouseAngle = data.state;

        if (this.pressingRight) this.x += this.maxSpeed;
        if (this.pressingLeft) this.x -= this.maxSpeed;
        if (this.pressingUp) this.y -= this.maxSpeed;
        if (this.pressingDown) this.y += this.maxSpeed;

        if (this.shooting) this.shoot(data.clickCoords);

        this.addState(this.getCurrentState());
    }
    
}

module.exports = Player;