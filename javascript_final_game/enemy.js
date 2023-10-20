class Enemy{
    constructor(){
        this.frameX = 0
        this.fps = 20
        this.frameInterval = 1000 / this.fps
        this.frameTimer = 0
        this.dead = false
    }
    update(deltaTime){
        // movement
        this.x += this.xspeed - this.game.gameSpeed
        this.y += this.yspeed
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) this.frameX++
            else this.frameX = 0
            this.frameTimer = 0 
        }
        this.frameTimer += deltaTime
    }
    draw(context){
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height)
        context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height,
                          this.x, this.y ,this.width, this.height)
    }
}

export class FlyingEnemy extends Enemy {
    constructor(game){
        super()
        this.game = game
        this.width = 60
        this.height = 44
        this.x = this.game.width - this.width
        this.y = Math.random() * this.game.height * 0.5
        this.xspeed = -Math.random() * 2 - 2 
        this.yspeed = 0
        this.maxFrame = 5
        this.image = document.getElementById('enemies_fly')
        this.angle = 0
        this.angleSpeed = Math.random() * 0.1 + 0.1
        this.vibr = Math.random() * 10
    }
    update(deltaTime){
        super.update(deltaTime)
        if (this.x + this.width < 0) this.dead = true
        this.angle += this.angleSpeed
        this.y += Math.sin(this.angle) * this.vibr
    }
}

export class GroundEnemy extends Enemy {
    constructor(game){
        super()
        this.game = game
        this.width = 60
        this.height = 87
        this.x = this.game.width
        this.y = this.game.height - this.height - this.game.groundMargin
        this.xspeed = 0
        this.yspeed = 0
        this.maxFrame = 1
        this.image = document.getElementById('enemies_flower')
    }
    update(deltaTime) {
        super.update(deltaTime)
        if (this.x + this.width < 0) this.dead = true
    }
}

export class ClimbingEnemy extends Enemy {
    constructor(game){
        super()
        this.game = game
        this.width = 120
        this.height = 144
        this.x = (Math.random() * 0.7 + 0.3) * (this.game.width - this.width)
        this.y = 0
        this.xspeed = 0
        this.yspeed = 4
        this.maxFrame = 5
        this.image = document.getElementById('enemies_spider')
    }
    update(deltaTime){
        super.update(deltaTime)
        if (this.y > this.game.height - this.height) this.yspeed *= -1
        if (this.yspeed < 0 && this.y + this.height < 0) this.dead = true
    }
    draw(context){
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width/1.5, this.height/1.5)
        context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height,
            this.x, this.y ,this.width/1.5, this.height/1.5)
        context.beginPath()
        context.moveTo(this.x + this.width/3, 0)
        context.lineTo(this.x + this.width/3, this.y + 50)
        context.stroke()
    }
}
