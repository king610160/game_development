import {StandingLeft, StandingRight, SittingLeft, SittingRight, RunningLeft, RunningRight, JumpingLeft, JumpingRight, FallingLeft, FallingRight} from './state.js'

export default class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth
        this.gameHeight = gameHeight
        this.states = [new StandingLeft(this), new StandingRight(this), new SittingLeft(this), new SittingRight(this),
                       new RunningLeft(this), new RunningRight(this), new JumpingLeft(this), new JumpingRight(this),
                       new FallingLeft(this), new FallingRight(this)]
        this.currentState = this.states[1]
        this.image = document.getElementById('dogImage')
        this.width = 200
        this.height = 181.83
        this.x = this.gameWidth/2 - this.width/2
        this.y = this.gameHeight - this.height
        this.frameX = 0
        this.frameY = 0
        this.xspeed = 0
        this.yspeed = 0
        this.maxSpeed = 10
        this.weight = 0.5
        this.maxFrame = 6
        this.fps = 30 // refresh frequency
        this.frameTimer = 0
        this.frameInterval = 1000/this.fps
    }
    draw(context, deltaTime){
        if (this.frameTimer > this.frameInterval) {
            if (this.frameX < this.maxFrame) this.frameX++
            else this.frameX = 0
            this.frameTimer = 0
        } else this.frameTimer += deltaTime
        
        // context.clearRect(0,0,this.gameWidth,this.gameHeight)
        context.drawImage(this.image, this.width * this.frameX, this.height * this.frameY, this.width, this.height, 
                          this.x, this.y, this.width, this.height)
    }
    update(input){ // use states.js 's handleInput method
        this.currentState.handleInput(input)
        // horizontal movement
        this.x += this.xspeed
        if (this.x <= 0) this.x = 0
        else if (this.x >= this.gameWidth - this.width) this.x = this.gameWidth - this.width
        // vertical movement
        this.y += this.yspeed
        if (!this.onGround()) {
            this.yspeed += this.weight
        } else {
            this.yspeed = 0
        }
    }
    setState(state){
        this.currentState = this.states[state]
        this.currentState.enter()
    }
    onGround() {
        return this.y >= this.gameHeight - this.height
    }
}