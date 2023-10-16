window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = 800
    canvas.height = 720
    let enemies = []
    let score = 0
    let gameOver = false
    const fullScreenButton = this.document.getElementById('fullScreenButton')

    class InputHandler {
        constructor() {
            this.keys = []
            this.touchY = ''
            this.touchTreshold = 30
            // ES6 arrow functions:
            // don't bind their own 'this', but they inheritthe one from their parent scope
            // this is called lexical scope
            window.addEventListener('keydown', e => {
                if ((e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight' )
                    && this.keys.indexOf(e.key) === -1) { // will only push one time
                    this.keys.push(e.key)
                } else if (e.key === 'Enter') restartGame()
            })
            window.addEventListener('keyup', e => {
                if (e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight' ) { // will only push one time
                    this.keys.splice(this.keys.indexOf(e.key), 1) // find position, and remove
                }
            })
            window.addEventListener('touchstart', e => {
                this.touchY = e.changedTouches[0].pageY
            })
            window.addEventListener('touchmove', e => {
                // swipe up and down mean to let finger continue on screen to go up or down
                const swipeDistance = e.changedTouches[0].pageY - this.touchY
                if (swipeDistance < -this.touchTreshold && this.keys.indexOf('swipe up') === -1) this.keys.push('swipe up')
                else if (swipeDistance > this.touchTreshold && this.keys.indexOf('swipe down') === -1) {
                    this.keys.push('swipe down')
                    if (gameOver) restartGame()
                }
            })
            window.addEventListener('touchend', e => {
                this.keys.splice(this.keys.indexOf('swipe up'), 1)
                this.keys.splice(this.keys.indexOf('swipe down'), 1)
                console.log(this.keys)
            })
        }
    }  

    class Player {
        constructor(gameWidth, gameHeight) { // dont want player go out of screen 
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.width = 200
            this.height = 200
            this.x = 0
            this.y = this.gameHeight - this.height
            this.image = document.getElementById('playerImage')
            this.frameX = 0
            this.frameY = 0
            this.maxFrame = 8
            this.fps = 20 // how fast the character's picture change
            this.frameTimer = 0
            this.frameInterval = 1000 / this.fps

            this.xspeed = 0
            this.yspeed = 0
            this.weight = 1.3
        }
        restart(){
            this.x = 0
            this.y = this.gameHeight - this.height
            this.frameX = 0
            this.frameY = 0
            this.maxFrame = 8
        }
        draw(context) {
            // context.strokeStyle = "white"
            // context.beginPath()
            // context.arc(this.x + this.width/2, this.y+this.height/2, this.width/2,0, Math.PI*2)
            // context.stroke()
            context.drawImage(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height,  
                              this.x, this.y, this.width, this.height)
        }
        update(input, deltaTime, enemies) {
            // collision collect
            enemies.forEach(enemy => {
                const dx = (enemy.x + enemy.width/2) - (this.x + this.width/2)
                const dy = (enemy.y + enemy.height/2) - (this.y + this.height/2)
                const distance = Math.sqrt(dx ** 2 + dy ** 2) * 1.2 
                if (distance <= enemy.width/2 + this.width/2) gameOver = true
            })
            // horizon move
            this.x += this.xspeed
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0
                else this.frameX++
                this.frameTimer = 0
            } else {
                this.frameTimer += deltaTime
            }
            

            if (input.keys.indexOf('ArrowRight') > -1) this.xspeed = 5
            else if (input.keys.indexOf('ArrowLeft') > -1) this.xspeed = -5
            else this.xspeed = 0

            // vertical move            
            if ((input.keys.indexOf('ArrowUp') > -1 || input.keys.indexOf('swipe up') > -1) && this.onGround()) this.yspeed -= 30
            this.y += this.yspeed
   

            if (!this.onGround()) { // when it's in jump state
                this.frameY = 1
                this.maxFrame = 5
                this.yspeed += this.weight                
            } else { // when it's in run state
                this.frameY = 0
                this.maxFrame = 8
                this.yspeed = 0
            }

            // to let object not to move out the screen
            if (this.x < 0) this.x = 0
            if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width

            if (this.y < 0) this.y = 0
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height
        }
        onGround() {
            return this.y >= this.gameHeight - this.height
        }
    }  

    class Background {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.image = document.getElementById('backgroundImage')
            this.x = 0
            this.y = 0
            this.width = 2400
            this.height = 720
            this.speed = 7
        }
        restart() {
            this.x = 0
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height)
            context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height)
        }
        update() {
            this.x -= this.speed
            if (this.x < -this.width) this.x = 0
        }
    }

    class Enemy {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.width = 160
            this.height = 119
            this.image = document.getElementById('enemyImage')
            this.x = this.gameWidth - this.width
            this.y = this.gameHeight - this.height
            this.xspeed = 8
            this.frameX = 0
            this.maxFrame = 5
            this.fps = 20 // how fast the character's picture change
            this.frameTimer = 0
            this.frameInterval = 1000 / this.fps
            this.dead = false
        }
        draw(context) {
            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update(deltaTime) {
            this.x -= this.xspeed
            if (this.x < -this.width) {
                this.dead = true
                score++
            }
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0
                else this.frameX++
                this.frameTimer = 0
            } else this.frameTimer += deltaTime
            
        }
    }
    
    function handleEnemies(deltaTime) {
        if (enemyTimer > enemyInterval + randomEnemyInterval) {
            enemies.push(new Enemy(canvas.width, canvas.height))
            randomEnemyInterval = Math.random() * 1000 + 500
            enemyTimer = 0
        } else enemyTimer += deltaTime
        enemies.forEach(enemy => {
            enemy.draw(ctx)
            enemy.update(deltaTime)
        })
        enemies = enemies.filter(enemy => !enemy.dead)
    }

    function displayStatusText(context) {
        context.textAlign = 'left'
        context.fillStyle = 'white'
        context.font = '40px Helvetica'
        context.fillText(`Score: ${score}`, 19, 49)
        context.fillStyle = 'black'
        context.font = '40px Helvetica'
        context.fillText(`Score: ${score}`, 20, 50)
        if (gameOver) {
            context.textAlign = 'center'
            context.fillStyle = 'white'
            context.fillText('Game Over, press Enter or swipe down to try again!', canvas.width/2, 200)
            context.fillStyle = 'black'
            context.fillText('Game Over, press Enter or swipe down to try again!', canvas.width/2 - 1, 200 - 1)
        }
    }

    function restartGame() {
        player.restart()
        background.restart()
        enemies = []
        score = 0
        gameOver = false
        animate(0)
    }

    function toggleFullScreen() {
        console.log(document.fullscreenElement)
        // document.fullscreenElement will show what element is full screen now
        if (!document.fullscreenElement) {
            // requestFullscreen() is asynchronous, return a promise, it is call to make
            // full screen
            canvas.requestFullscreen().catch(err => {
                alert(`Error, can't enable to enter full-screen mode : ${err.message}`)
            })
        } else {
            document.exitFullscreen()
        }
        
    }
    fullScreenButton.addEventListener('click', toggleFullScreen)
    

    const input = new InputHandler()
    const player = new Player(canvas.width, canvas.height)
    const background = new Background(canvas.width, canvas.height)

    let lastTime = 0
    let enemyTimer = 0
    let enemyInterval = 1000
    let randomEnemyInterval = Math.random() * 1000 + 500

    function animate(timestamp) {
        const deltaTime = timestamp - lastTime
        lastTime = timestamp
        ctx.clearRect(0,0,canvas.width,canvas.height)
        background.draw(ctx)
        background.update()
        handleEnemies(deltaTime)
        player.draw(ctx)
        player.update(input, deltaTime, enemies) // let keydown and up as controller
        displayStatusText(ctx)
        if (!gameOver) requestAnimationFrame(animate)
    }
    animate(0)
})

