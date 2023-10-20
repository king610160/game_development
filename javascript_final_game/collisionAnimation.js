export class CollisionAnimation {
    constructor(game, x, y){
        this.game = game
        this.image = document.getElementById('boom')
        this.spriteWidth = 100
        this.spriteHeight = 90
        this.sizeModifier = Math.random() + 0.5
        this.width = this.spriteWidth * this.sizeModifier
        this.height = this.spriteHeight * this.sizeModifier
        this.x = x - this.width * 0.5
        this.y = y - this.height * 0.5
        this.frameX = 0
        this.maxFrame = 4
        this.dead = false
        this.fps = 15
        this.frameInterval = 1000 / this.fps
        this.frameTimer = 0
    }
    draw(context){
        context.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 
                          this.x, this.y, this.width, this.height)
    }
    update(deltaTime){
        this.x -= this.game.gameSpeed
        if (this.frameTimer > this.frameInterval) {
            this.frameX++
            this.frameTimer = 0
            if (this.frameX > this.maxFrame) this.dead = true
        } 
        this.frameTimer += deltaTime
    }
}