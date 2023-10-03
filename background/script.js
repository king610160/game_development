const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
const CANVAS_WIDTH = canvas.width = 800
const CANVAS_HEIGHT = canvas.height = 700
let gameSpeed = 5
// let gameFrame = 0

const backgroundLayer1 = new Image()
backgroundLayer1.src = 'layer-1.png'
const backgroundLayer2 = new Image()
backgroundLayer2.src = 'layer-2.png'
const backgroundLayer3 = new Image()
backgroundLayer3.src = 'layer-3.png'
const backgroundLayer4 = new Image()
backgroundLayer4.src = 'layer-4.png'
const backgroundLayer5 = new Image()
backgroundLayer5.src = 'layer-5.png'

window.addEventListener('load', function(){ // only when page full load, can game start
    const slider = document.getElementById('slider') // 確認slider
    slider.value = gameSpeed  // 初始化速度，用slider中的value
    const showGameSpeed = document.getElementById('showGameSpeed')
    showGameSpeed.innerHTML = gameSpeed // 將show的值改成slider所選擇的值
    slider.addEventListener('change', function(e){
        gameSpeed = e.target.value
        showGameSpeed.innerHTML = gameSpeed
    })

    class Layer { // 建立新的class來放愈創造的物件
        constructor(image, speedModifier) {
            this.x = 0
            this.y = 0
            this.width = 2400
            this.height = 700
            this.image = image
            this.speedModifier = speedModifier
            this.speed = gameSpeed * this.speedModifier // speed會是gameSpeed乘上modifier
        }
        update(){
            this.speed = gameSpeed * this.speedModifier
            if (this.x <= -this.width) this.x = 0
            this.x -= this.speed
            // this.x = gameFrame * this.speed % this.width // use gameFrame to control speed
        }
        draw(){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
            // 一般來說是把this.x設為this.x + this.width，但會破圖。所以 - 1，讓部分圖重疊
            ctx.drawImage(this.image, this.x + this.width - 1, this.y, this.width, this.height)
        }
    }

    const layer1 = new Layer(backgroundLayer1, 0.5)
    const layer2 = new Layer(backgroundLayer2, 1)
    const layer3 = new Layer(backgroundLayer3, 1.5)
    const layer4 = new Layer(backgroundLayer4, 2)
    const layer5 = new Layer(backgroundLayer5, 3)

    const gameObjects = [layer1, layer2, layer3, layer4, layer5] // 將layer放進array，再用forEach取出

    function animate() {
        ctx.clearRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)
        gameObjects.forEach(object => {
            object.update()
            object.draw()
        })
        // gameFrame--
        requestAnimationFrame(animate)
    }
    animate()
})

