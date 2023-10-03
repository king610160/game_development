let playerState = 'roll'
const dropdown = document.getElementById('animations')
dropdown.addEventListener('change', function(e){
    playerState = e.target.value
    console.log(e.target)
})


const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
// console.log(ctx)

const CANVAS_WIDTH = canvas.width = 600
const CANVAS_HEIGHT = canvas.height = 600

const playerImage = new Image()
playerImage.src = 'shadow_dog.png'
const spriteWidth = 575 // x軸共12圖，總長為6876，1圖約為573，但最後圖有壓縮，取575
const spriteHeight = 523 // y軸共10圖，總長為5230，1圖為523


let gameFrame = 0 
const staggerFrames = 3 // to let slow down by five times
const spriteAnimations = []
const animationStates = [
    {
        name:'idle',
        frames: 7,
    },
    {
        name:'jump',
        frames: 7,
    },
    {
        name:'fail',
        frames: 7,
    },
    {
        name:'run',
        frames: 9,
    },
    {
        name:'dizzy',
        frames: 11,
    },
    {
        name:'sit',
        frames: 5,
    },
    {
        name:'roll',
        frames: 7,
    },
    {
        name:'bite',
        frames: 7,
    },
    {
        name:'ko',
        frames: 12,
    },
    {
        name:'getHit',
        frames: 4,
    }
]

animationStates.forEach((state, index) => {
    let frames = {
        loc: [],
    }
    let positionY = index * spriteHeight
    for (let j = 0; j < state.frames; j++) {
        let positionX = j * spriteWidth
        frames.loc.push({x : positionX, y: positionY})
    }
    spriteAnimations[state.name] = frames;
})
console.log(spriteAnimations)

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT) // to clean all canvas1 to blank
    // 讓posi在loc長度間循環, 也可以代表使用哪一格的動作，staggerFrames是讓偵變慢的一個數
    let position = Math.floor(gameFrame/staggerFrames) % spriteAnimations[playerState].loc.length 
    
    let frameX = spriteWidth * position // 讓frameX去乘相對位置，x為動作偵數
    let frameY = spriteAnimations[playerState].loc[position].y // 改變每列，這裡是換動作

    // ctx.drawImage(Image, sx, sy, sw, sh, dx, dy, dw, dh)
    // sx, sy是要裁的點，sw, sh是要裁的寬高。dx, dy是要畫的點，dw, dh是要畫進去的寬高
    ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 
    0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    gameFrame++
    requestAnimationFrame(animate)
}
animate()