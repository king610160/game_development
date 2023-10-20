class Particle {
    constructor(game){
        this.game = game
        this.dead = false
    }
    update(){
        this.x -= this.xspeed + this.game.gameSpeed
        this.y -= this.yspeed
        this.size *= 0.95
        // this.a *= 0.75
        if (this.size < 0.5) this.dead = true
        // if (this.a < 0.1) this.dead = true
    }
}

export class Dust extends Particle {
    constructor(game, x, y){
        super(game)
        this.size = Math.random() * 10 + 10
        this.x = x
        this.y = y
        this.xspeed = Math.random()
        this.yspeed = Math.random()
        this.a = 0.2
        this.color = `rgba(0,0,0,${this.a})`
    }
    draw(context){
        context.beginPath()
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        context.fillStyle = this.color
        context.fill()
    }
}

export class Fire extends Particle {
    constructor(game, x, y){
        super(game)
        this.image = document.getElementById('fire')
        this.size = Math.random() * 100 + 50
        this.x = x
        this.y = y
        this.xspeed = 1
        this.yspeed = 1
        this.angle = 0
        this.aspeed = Math.random() * 0.2 - 0.1
    }
    update(){
        super.update()
        this.angle += this.aspeed
        this.x += Math.sin(this.angle * 5)
    }
    draw(context){
        context.save()
        context.translate(this.x, this.y) // re define the origin point
        context.rotate(this.angle)
        context.drawImage(this.image, 0, 0, this.size, this.size)
        // context.drawImage(this.image, -this.size * 0.5, -this.size * 0.5, this.size, this.size)  // can draw fire in the center
        context.restore()
    }
}

export class Splash extends Particle {
    constructor(game, x, y){
        super(game)
        this.size = Math.random() * 100 + 100
        this.x = x
        this.y = y
        this.xspeed = Math.random() * 6 - 4
        this.yspeed = Math.random() * 2 + 1
        this.gravity = 0
        this.image = document.getElementById('fire')
    }
    update(){
        super.update()
        this.gravity += 0.1
        this.y += this.gravity
    }
    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.size, this.size)
    }
}