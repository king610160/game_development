document.addEventListener('DOMContentLoaded', function() {
    // use load for online use
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    const CANVAS_WIDTH = canvas.width = 500
    const CANVAS_HEIGHT = canvas.height = 800

    class Game {
        constructor(ctx, width, height) {
            this.ctx = ctx
            this.width = width
            this.height = height
            this.enemies = []
            this.enemyInterval = 500
            this.enemyTimer = 0
            this.enemyTypes = ['worm','ghost','spider']
        }
        update(deltaTime){
            this.enemies = this.enemies.filter(object => !object.dead) // 每次更新只會留下活著的object
            if (this.enemyTimer > this.enemyInterval) {
                this.#addNewEnemy() // 增加敵人
                this.enemyTimer = 0
            } else this.enemyTimer += deltaTime

            console.log(this.enemies)
            this.enemies.forEach(object => object.update(deltaTime))
        }
        draw(){ // 畫在指定的canvas上
            this.enemies.forEach(object => object.draw(this.ctx))
        }
        #addNewEnemy(){
            const randomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)]
            if (randomEnemy === 'worm') this.enemies.push(new Worm(this)) // 讓enemy把整包的game都傳進去
            else if (randomEnemy === 'ghost') this.enemies.push(new Ghost(this))
            else if (randomEnemy === 'spider') this.enemies.push(new Spider(this))
        }
    }

    class Enemy {
        constructor(game) {
            this.game = game
            this.dead = false
            this.frameX = 0
            this.maxFrame = 5 // 每個動圖只有6偵
            this.frameInterval = 100
            this.frameTimer = 0
        }
        update(deltaTime) {
            this.x -= this.xspeed * deltaTime
            if (this.x + this.width < 0) this.dead = true
            if (this.frameTimer > this.frameInterval) {
                this.frameX < this.maxFrame ? this.frameX++ : this.frameX = 0
                this.frameTimer = 0
            } else {
                this.frameTimer += deltaTime // 是為了讓快/慢電腦都是同個偵數下去跑遊戲
            }
        }
        draw(ctx) { // 用game傳進來的ctx去畫，而不是畫在global上
            // ctx.fillRect(this.x, this.y, this.width, this.height)
            ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,this.x, this.y, this.width, this.height)
        }
    }

    class Worm extends Enemy {  // 繼承某些特性
        constructor(game) {
            super(game) // super必須在this之前使用
            this.spriteWidth = 229
            this.spriteHeight = 171 
            this.width = this.spriteWidth / 2
            this.height = this.spriteHeight / 2
            this.xspeed = Math.random() * 0.1 + 0.1
            this.x = this.game.width
            this.y = this.game.height - this.height // 蟲子只會在地上爬
            this.image = worm
        }
    }

    class Ghost extends Enemy {  // 繼承某些特性
        constructor(game) {
            super(game) // super必須在this之前使用
            this.spriteWidth = 261
            this.spriteHeight = 209 
            this.width = this.spriteWidth / 2
            this.height = this.spriteHeight / 2
            this.image = ghost
            this.x = this.game.width
            this.y = Math.random() * this.game.height * 0.6 // 只出現在螢幕上方0.6的地方
            this.xspeed = Math.random() * 0.2 + 0.1
            this.angle = 0
            this.curve = Math.random() * 3 + 3
        }
        update(deltaTime) {
            super.update(deltaTime)
            this.y += Math.sin(this.angle) * this.curve
            this.angle += 0.05
        }
        draw(ctx) {
            ctx.save()
            ctx.globalAlpha = 0.5
            super.draw(ctx) // 繼承父元素的屬性
            ctx.restore( )
        }
    }

    class Spider extends Enemy {  // 繼承某些特性
        constructor(game) {
            super(game) // super必須在this之前使用
            this.spriteWidth = 310
            this.spriteHeight = 175 
            this.width = this.spriteWidth / 2
            this.height = this.spriteHeight / 2
            this.x = Math.random() * (this.game.width - this.width)
            this.y = 0 - this.height // only move up and down
            this.image = spider
            this.xspeed = 0
            this.yspeed = Math.random() * 0.1 + 0.2
            this.maxDepth = Math.random() * this.game.height * 0.8
        }
        update(deltaTime) {
            super.update(deltaTime)
            if (this.y < 0 - this.height * 2) this.dead = true
            this.y += this.yspeed * deltaTime
            if (this.y > this.maxDepth) this.yspeed *= -1
        }
        draw(ctx) {
            ctx.beginPath()
            ctx.moveTo(this.x + this.width/2,5)
            ctx.lineTo(this.x + this.width/2, this.y+5)
            ctx.stroke()
            super.draw(ctx)
        }
    }

    const game = new Game(ctx, canvas.width, canvas.height) // 把畫在哪個canvas的寫好
    let lastTime = 1
    function animate(timeStamp) {
        ctx.clearRect(0,0,canvas.width,canvas.height)
        const deltaTime = timeStamp - lastTime // 計算deltaTime, 可視為每過多少ms刷新一次畫面
        lastTime = timeStamp
        game.update(deltaTime)
        game.draw()
        requestAnimationFrame(animate)
    }
    animate(0)
})

