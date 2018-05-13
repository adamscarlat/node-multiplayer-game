var Entity = require('./entity')

/*
Bullet entity. Fires from other entities. Has a set angle, range and speed.
Bounces of walls. Also has a parent - the entity that fired it
*/
class Bullet extends Entity {

    constructor(mediator, x, y, angle, parent) { 
        super(mediator, x, y);
        this.maxSpeed = 25;
        this.angle = angle;
        this.parent = parent;
        this.range = 40;
        this.removed = false;
        this.type = 'bullet';
        this.damage = 2;

        this.setInitialVector();
    }
    
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
            range: this.range,
            maxSpeed: this.maxSpeed,
            parent: this.parent.id,
            damage: this.damage,
        }
    }

    /*
    Sets the initial vector (or trajectory) for this bullet. The bullet will
    continue in this set trajectory until it reaches its range.
    */
    setInitialVector() {
        this.spdX = Math.cos(this.angle / 180 * Math.PI) * this.maxSpeed;
        this.spdY = Math.sin(this.angle / 180 * Math.PI) * this.maxSpeed;
        this.timer = 0;

        var yTraj = 1;
        var xTraj = 1;
        while (this.timer++ < this.range) {
            this.x += xTraj * this.spdX;
            this.y += yTraj * this.spdY;

            //if hit y-wall reverse axis trajectory 
            if (this.y <= 10 || this.y >= 500) {
                yTraj = -1;
            }

            //if hit x-wall reverse axis trajectory 
            if (this.x <= 10 || this.x >= 500) {
                xTraj = -1;
            }

            this.addState(this.getCurrentState());

            //check for collisions and act
            if (this.mediator.checkCollisions(this)) {
                break;
            }
            
        } 
        this.removeSelf(); 
            
    }

    /*
    Collision handler - called from entityMediator upon collision
    */
    handleCollision(otherEntity) {
        this.parent.score += 1;
        if (otherEntity.type === 'player') {
            this.handlePlayerCollision(otherEntity);
        }        
    }


    /*
    When a player collides with another entity, we handle the collision here
    and update the state of the player. The state of the player is then pushed
    to the colliding entities event queue (instead of the player's like any other player event).

    This is done is so that the collision will happen in the correct time according 
    to the main game loop (see EntityMediator.getGameState). 
    */
    handlePlayerCollision(playerEntity) {
        var state = playerEntity.getCurrentState();

        playerEntity.hp -= this.damage;
        state.hp = playerEntity.hp;

        if (playerEntity.hp <= 0) {
            state.removed = true;
        }

        this.addState(state);
    }
}

module.exports = Bullet;