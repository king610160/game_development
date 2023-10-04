/** @type {HTMLCanvasElement} */  //  know this project is canvas project

const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
const CANVAS_WIDTH = canvas.width = 500
const CANVAS_HEIGHT = canvas.height = 1000
const enemiesCount = 20
const enemiesArr = []
let gameFrame = 0
let speed = 6 // 用來調整偵刷新的速度

class Enemy {
    constructor(src, sw, sc, picT) {
        this.image = new Image()
        this.image.src = src
        this.total = picT // 總共幾張圖片

        // 讓物件可上下左右移動
        // this.xspeed = Math.random() * 4 - 2
        // this.yspeed = Math.random() * 4 - 2

        // 圖片實際長寬
        this.spriteWidth = sw
        this.spriteHeight = sc
        
        // 圖片顯示長寬
        this.width = this.spriteWidth / 2.5
        this.height = this.spriteHeight / 2.5

        // 隨機產生
        this.x = Math.random() * (CANVAS_WIDTH - this.width)
        this.y = Math.random() * (CANVAS_HEIGHT - this.height)
        this.frame = Math.floor(Math.random() * this.total) // 物件產生在0-5的frame中
    }
    update() {
        // 任意位置區間內移動 - enemy1
        this.x += Math.random() * 7 - 3.5
        this.y += Math.random() * 5 - 2.5

        // 讓東西能夠反彈 - 自己想的
        // if (this.x + this.width > CANVAS_WIDTH) this.xspeed *= -1
        // if (this.x < 0) this.xspeed *= -1
        // if (this.y + this.height > CANVAS_HEIGHT) this.yspeed *= -1
        // if (this.y < 0) this.yspeed *= -1

        // 只有在gameFrame可被speed整除時才把frame給reset
        if (gameFrame % speed === 0) { 
            this.frame >= this.total - 1 ? this.frame = 0 : this.frame++
        }
    }
    draw() {
        ctx.strokeRect(this.x, this.y, this.width, this.height) // 畫外框
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth,this.spriteHeight,
        this.x, this.y, this.width, this.height)
    }
}

for (let i = 0; i < enemiesCount; i++) {
    enemiesArr.push(new Enemy('enemy1.png',293,155,6))
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