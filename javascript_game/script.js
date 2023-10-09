const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const collisionCanvas = document.getElementById('collisionCanvas')
const collisionCtx = collisionCanvas.getContext('2d')
collisionCanvas.width = window.innerWidth
collisionCanvas.height = window.innerHeight

let score = 0
let gameOver = false
ctx.font = '50px Impact' // 讓font變50px

let timeToNextRaven = 0
let ravenInterval = 500
let lastTime = 0

let ravens = []
class Raven {
    constructor() {
        this.spriteWidth = 271
        this.spriteHeight = 194
        this.sizeModifier = Math.random() * 0.6 + 0.4
        this.width = this.spriteWidth * this.sizeModifier
        this.height = this.spriteHeight * this.sizeModifier
        this.x = canvas.width // 從最後面飛出來
        this.y = Math.random() * (canvas.height - this.height) // 需減去一個圖片的高度
        this.directionX = Math.random() * 5 + 3
        this.directionY = Math.random() * 5 - 2.5
        this.end = false // 確認是否有被觸發到
        this.image = new Image()
        this.image.src = 'raven.png'

        this.frame = 0
        this.maxFrame = 4
        this.timeSinceFlap = 0
        this.flapInterval = Math.random() * 50 + 50

        // 用來當rgb的顏色
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
        this.color = `rgba(${this.randomColors[0]},${this.randomColors[1]},${this.randomColors[2]},1)`
        this.hasTrail = Math.random() > 0.5 // 有些有tail，有些沒有
    }
    update(deltatime) {  
        // 用deltatime是為了讓快電腦和慢電腦享有同個時間gap，雖然慢電腦偵測慢，但在超過某時間仍會觸發遊戲機制
        // 不會因電腦快慢而有所差異
        if (this.y < 0 || this.y > canvas.height - this.height) this.directionY *= -1

        this.x -= this.directionX
        this.y += this.directionY
        if (this.x + this.width < 0) this.end = true // 當碰到底的時候，將物件的end設為true
        this.timeSinceFlap += deltatime  // 每次flap加入deltatime
        if (this.timeSinceFlap > this.flapInterval) { // 當大於inteval時，換下個frame，若大於max則reset
            this.frame > this.maxFrame ? this.frame = 0 : this.frame++
            this.timeSinceFlap = 0
            for (let i = 0; i < 5; i++) {
                if (this.hasTrail) particles.push(new Particle(this.x, this.y, this.width, this.color))
            }
        }
        if (this.x + this.width < 0) gameOver = true
    }
    draw() {
        collisionCtx.fillStyle = this.color
        collisionCtx.fillRect(this.x, this.y, this.width, this.height) // 給顏色
        // ctx.strokeRect(this.x, this.y, this.width, this.height) // 給外框
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    }
}

let explosions = []
class Explosion {
    constructor(x, y, size) {
        this.image = new Image()
        this.image.src = 'boom.png'
        this.spriteWidth = 200
        this.spriteHeight = 179
        this.size = size
        this.x = x
        this.y = y
        this.frame = 0
        this.maxFrame = 4
        this.sound = new Audio()
        this.sound.src = 'bomb.flac'
        this.timeSinceLastFrame = 0
        this.frameInterval = 200
        this.end = false
    }
    update(deltatime) {
        if (this.frame === 0) this.sound.play() 
        this.timeSinceLastFrame += deltatime  
        if (this.timeSinceLastFrame > this.frameInterval) { // 當大於inteval時，換下個frame，若大於max則reset
            this.frame > this.maxFrame ? this.end = true : this.frame++
            this.timeSinceLastFrame = 0
        }
    }
    draw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 
                      this.x, this.y - this.size/4, this.size, this.size)
    }
}

let particles = []
class Particle {
    constructor(x, y, size, color) {
        this.size = size
        this.x = x + size / 2
        this.y = y + size / 3
        this.radius = Math.random() * this.size / 10
        this.end = false
        this.speedX = Math.random() + 0.5 // 0.5 - 1.5
        this.color = color
        this.timeToDisappear = 0
        this.timeInterval = Math.random() * 500 + 500 // 500 - 1000
    }
    update(deltatime) {
        this.x += this.speedX
        this.radius += Math.random() * 0.2
        this.timeToDisappear += deltatime
        if (this.timeToDisappear > this.timeInterval) this.end = true
    }
    draw() {
        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
    }
}

function drawScore() {
    ctx.fillStyle = 'black'
    ctx.fillText(`Score:  ${score}`, 50, 75)
    ctx.fillStyle = 'white'
    ctx.fillText(`Score:  ${score}`, 52.5, 77.5)
}

function drawGameOver() {
    ctx.textAlign = 'center'
    ctx.fillStyle = 'black'
    ctx.fillText(`Game Over,  Your score is  ${score}`, canvas.width/2, canvas.height/2)
    ctx.fillStyle = 'white'
    ctx.fillText(`Game Over,  Your score is  ${score}`, canvas.width/2 + 2.5, canvas.height/2 + 2.5)
}

window.addEventListener('click', function(e) {
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1) // 到那個區域，掃描1px, 1px的大小
    const pc = detectPixelColor.data
    ravens.forEach(object => { // 遍歷時要用object，不要用到this
        if (object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]) {
            //  collision detected
            console.log(object)
            object.end = true
            score++
            explosions.push(new Explosion(object.x, object.y, object.width))
        }
    })
})

function animate(timestamp) {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    collisionCtx.clearRect(0,0,collisionCanvas.width,collisionCanvas.height)  // 另一個圖層清掉
    let deltatime = timestamp - lastTime
    lastTime = timestamp
    timeToNextRaven += deltatime
    if (timeToNextRaven > ravenInterval) { // 在ravenInterval後，才能再創造新的raven
       ravens.push(new Raven())
       timeToNextRaven = 0
       ravens.sort((a,b) => a.width - b.width) // 讓小隻的永遠在大的後面
    }

    [...particles,...ravens,...explosions].forEach((object) => {
        object.update(deltatime)
        object.draw()
    });

    ravens = ravens.filter(object => !object.end) // 所有被觸發的物件都不會再被顯示
    explosions = explosions.filter(object => !object.end) // 所有被觸發的物件都不會再被顯示
    particles = particles.filter(object => !object.end) // 所有被觸發的物件都不會再被顯示
    drawScore() // score放在後面是為了讓遊戲中的score不要被擋到
    
    if (!gameOver) requestAnimationFrame(animate)
    else drawGameOver()
}
animate(0) // 將值傳入的目的是因為timestamp在一開始會是undefined，所以給個初始值