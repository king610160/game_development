/** @type {HTMLCanvasElement} */  //  know this project is canvas project

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
const CANVAS_WIDTH = canvas.width = 500
const CANVAS_HEIGHT = canvas.height = 1000
const enemiesCount = 20
const enemiesArr = []
let gameFrame = 0

class Enemy {
    constructor() {
        this.image = new Image()
        this.image.src = 'enemy1.png'

        // this.xspeed = Math.random() * 4 - 2
        // this.yspeed = Math.random() * 4 - 2
        this.spriteWidth = 293
        this.spriteHeight = 155
        
        this.width = this.spriteWidth / 2.5
        this.height = this.spriteHeight / 2.5

        this.x = Math.random() * (CANVAS_WIDTH - this.width)
        this.y = Math.random() * (CANVAS_HEIGHT - this.height)
        this.frame = Math.random() * 5
    }
    update() {
        this.x += Math.random() * 7 - 3.5
        this.y += Math.random() * 5 - 2.5
        // 讓東西能夠反彈
        // if (this.x + this.width > CANVAS_WIDTH) this.xspeed *= -1
        // if (this.x < 0) this.xspeed *= -1
        // if (this.y + this.height > CANVAS_HEIGHT) this.yspeed *= -1
        // if (this.y < 0) this.yspeed *= -1
        if (gameFrame % 4 === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++
        }
    }
    draw() {
        ctx.strokeRect(this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth,this.spriteHeight,
        this.x, this.y, this.width, this.height)
    }
}

for (let i = 0; i < enemiesCount; i++) {
    enemiesArr.push(new Enemy())
}

function animate() {
    ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
    enemiesArr.forEach((enemy) => {
        enemy.update()
        enemy.draw()
    })
    gameFrame++
    requestAnimationFrame(animate)
}
animate()