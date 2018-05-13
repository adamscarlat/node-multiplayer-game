class Bullet extends Entity {
    constructor(args) {
        super(args);
        
        this.img = new Image();
        this.img.src = '../img/bullet.png';
    }

    draw() {
        // var x = this.x - SELF_PLAYER.x + CANVAS_WIDTH / 2;
        // var y = this.y - SELF_PLAYER.y + CANVAS_HEIGHT / 2;

        var imgWidth = this.img.width / 2;
        var imgHeight = this.img.height / 2;

        //canvas.fillText(this.id[0], this.x, this.y);
        CANVAS.drawImage(this.img, 0, 0, this.img.width, this.img.height, 
            this.x - imgWidth/2, this.y - imgHeight/2, imgWidth, imgHeight)

    }
}