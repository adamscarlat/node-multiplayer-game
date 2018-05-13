class Guard extends Entity {
    constructor(mediator, socket, x, y) {
        super(mediator, x, y);
        this.maxSpeed = 10;
        this.removed = false;
        this.type = 'guard';
        this.damage = 2;

        this.setInitialVector();
    }

    getCurrentState() {
        return {
            removed: this.removed,
            id: this.id,
            type: this.type,
            x: this.x,
            y: this.y,
            maxSpeed: this.maxSpeed,
            damage: this.damage,
        }
    }

    setInitialVector() {
        this.spdY = Math.cos(90 / 180 * Math.PI) * this.maxSpeed;

        var yTraj = 1;
        setInterval(function() {
            this.y += yTraj * this.spdY;
    
            if (this.y <= 10 || this.y >= 540) {
                yTraj = -1;
            }
            
            this.addState(this.getCurrentState());

            if (this.mediator.checkCollisions(this)) {
                console.log('guard collided...')
            }

        }, 20);
    }

    handleCollision(otherEntity) {
        this.removeSelf(); 
    }
}