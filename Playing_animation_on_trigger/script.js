const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')

const CANVAS_WIDTH = canvas.width = 500
const CANVAS_HEIGHT = canvas.height = 700
const explosions = []
let canvasPosition = canvas.getBoundingClientRect() // 找出canvas畫東西的相對位置
const width = 50
const height = 100
const gameFrame = 5

class Explosions {
    constructor(x, y) {
        // 原圖尺寸
        this.spriteWidth = 200
        this.spriteHeight = 179
        // 畫入圖尺寸
        this.width = this.spriteWidth/2
        this.height = this.spriteHeight/2
        // 產生在的座標
        this.x = x
        this.y = y 
        this.image = new Image()
        this.image.src = 'boom.png'
        this.frame = 0
        this.timer = 0
        this.angle = Math.random() * 6.2
        this.sound = new Audio()
        this.sound.src = 'bomb.flac'
    }
    update() {
        if (this.frame === 0) this.sound.play()
        this.timer++ // 每次update時timer會++
        if (this.timer % gameFrame === 0) this.frame++ // 只有當timer = gameFrame時frame才會++
    }
    draw() {
        ctx.save() // 讓canvas旋轉的方法
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, 0-this.width/2, 0-this.height/2, this.width, this.height)
        ctx.restore()
    }
}

window.addEventListener('click', function(e) { // 點擊時有效果
    createAnimate(e)
})

// window.addEventListener('mousemove', function(e) { // 滑鼠滑過有效果
//     createAnimate(e)
// })

function createAnimate(e) { // 創造的物件會差canvas到(0,0)的距離，所以要修正
    let positionX = e.x - canvasPosition.left
    let positionY = e.y - canvasPosition.top
    explosions.push(new Explosions(positionX,positionY))
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0 ; i < explosions.length; i++) {
        explosions[i].update()
        explosions[i].draw()
        if(explosions[i].frame > 5) { // 若explosions[i]的frame走完，就把explosion裡的東西清掉
            explosions.shift() // 總是刪最前面的，有時候會有問題
            // explosions.splice(i,1) // 哪個沒有就刪哪個
            i--
        }
    }
    requestAnimationFrame(animate)
}
animate()