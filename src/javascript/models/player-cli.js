class Player extends Entity {
    constructor(args) {
        super(args);
        this.hp = args.hp;
        this.maxHp = args.maxHp;
        this.score = args.score;
        this.socketId = args.socketId;

        this.img = new Image();
        this.img.src = '../img/player.png';
    }

    updateState(state) {
        this.x = state.x;
        this.y = state.y;
        this.hp = state.hp;
        this.score = state.score;
    }

    draw() {
        // var x = this.x - SELF_PLAYER.x + CANVAS_WIDTH / 2;
        // var y = this.y - SELF_PLAYER.y + CANVAS_HEIGHT / 2;

        var hpWidth = 30 * this.hp / this.maxHp;
        CANVAS.fillStyle = 'red';
        CANVAS.fillRect(this.x - hpWidth/2, this.y - 40, hpWidth, 4);

        var imgWidth = this.img.width * 1.5;
        var imgHeight = this.img.height * 1.5;

        //canvas.fillText(this.id[0], this.x, this.y);
        CANVAS.drawImage(this.img, 0, 0, this.img.width, this.img.height, 
            this.x - imgWidth/2, this.y - imgHeight/2, imgWidth, imgHeight)
    }

    /*
    Draw only for this entity
    */
    drawSelfData() {
        CANVAS.fillStyle = 'white';
        CANVAS.fillText(this.score, 0, 30);
    }
}