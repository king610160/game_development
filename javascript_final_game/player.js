import { Standing, Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from "./playerState.js"
import { CollisionAnimation } from './collisionAnimation.js'
import { FloatingMessage } from './floatingMessage.js'

export default class Player {
    constructor(game){
        this.game = game
        this.width = 100
        this.height = 91.3
        this.image = document.getElementById('player')
        this.x = 0
        this.y = this.game.height - this.height - this.game.groundMargin
        this.frameX = 0
        this.frameY = 0
        this.maxFrame = 0
        this.xspeed = 0
        this.yspeed = 0
        this.weight = 0.6
        this.states = [new Standing(this.game),new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game)]

        this.fps = 30
        this.frameTimer = 0
        this.frameInterval = 1000/this.fps
    }
    update(input, deltaTime){
        this.checkCollision()
        this.currentState.handleInput(input)
        // horizon movement
        if (input.includes('ArrowLeft') && this.currentState !== 8) this.xspeed--
        else if (input.includes('ArrowRight') && this.currentState !== 8) this.xspeed++
        else this.xspeed = 0
        this.x += this.xspeed
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width
        if (this.x < 0) this.x = 0

        // vertical movement
        this.y += this.yspeed
        // if (input.includes('ArrowUp') && this.onGround()) this.yspeed -= 20
        if (!this.onGround()) this.yspeed += this.weight
        else if (this.onGround()) this.yspeed = 0
        if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin
        if (this.y < 0) this.y = 0

        // sprite animate
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) this.frameX++
            else this.frameX = 0
            this.frameTimer = 0
        } 
        this.frameTimer += deltaTime
    }
    draw(context){
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height)
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height,
                         this.x, this.y, this.width, this.height)
    }
    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin
    }
    setState(state, speed){
        this.currentState = this.states[state]
        this.game.gameSpeed = this.game.maxGameSpeed * speed
        this.currentState.enter()
    }
    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if (
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ) {
                enemy.dead = true
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))
                if (this.currentState === this.states[5] || this.currentState === this.states[6]){
                    this.game.score++
                    this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, -20, -20))
                } else {
                    this.setState(7,0)
                    this.game.lives--
                    if (!this.game.lives) this.game.gameOver = true
                }
            }
        });
    }
}