import { Dust, Fire, Splash } from './particle.js'

const states = {
    STANDING: 0,
    SITTING: 1,
    RUNNING: 2,
    JUMPING: 3,
    FALLING: 4,
    ROLLING: 5,
    DIVING: 6,
    HIT: 7,
}

class State {
    constructor(state, game){
        this.state = state
        this.game = game
    }
    enter(){
        this.game.player.frameX = 0
    }
}

export class Standing extends State {
    constructor(game){
        super('STANDING',game)  // means to inherite State property, set state as STANDING
    }
    enter(){
        this.game.player.frameY = 0
        this.game.player.maxFrame = 6
    }
    handleInput(input){
        if (input.includes('ArrowLeft') || input.includes('ArrowRight')) this.game.player.setState(states.RUNNING,1)
        else if (input.includes('ArrowDown')) this.game.player.setState(states.SITTING,0)
        else if (input.includes('ArrowUp')) this.game.player.setState(states.JUMPING,1)
    }
}

export class Sitting extends State {
    constructor(game){
        super('SITTING',game)
    }
    enter(){
        this.game.player.frameY = 5
        this.game.player.maxFrame = 4
    }
    handleInput(input){
        // if (input.includes('ArrowLeft') || input.includes('ArrowLeft')) this.game.player.setState(states.RUNNING)
        if (input.includes('ArrowUp')) this.game.player.setState(states.STANDING,0)
    }
}

export class Running extends State {
    constructor(game){
        super('RUNNING',game) 
    }
    enter(){
        this.game.player.frameY = 3
        this.game.player.maxFrame = 8
    }
    handleInput(input){
        this.game.particles.push(new Dust(this.game, this.game.player.x + this.game.player.width * 0.1, this.game.player.y + this.game.player.height * 0.85))
        if (input.includes('ArrowDown')) this.game.player.setState(states.SITTING,0)
        else if (input.includes('ArrowUp')) this.game.player.setState(states.JUMPING,2)
        else if (input.includes('Enter')) this.game.player.setState(states.ROLLING,4)
    }
}

export class Jumping extends State {
    constructor(game){
        super('JUMPING',game)
    }
    enter(){
        if (this.game.player.onGround()) this.game.player.yspeed -= 20
        this.game.player.frameY = 1
        this.game.player.maxFrame = 6
    }
    handleInput(input){
        // use unshift will remove old particles
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.15 , this.game.player.y + this.game.player.height * 0.25))
        if (this.game.player.yspeed >= 0) this.game.player.setState(states.FALLING,2)
        else if (input.includes('Enter')) this.game.player.setState(states.ROLLING,4)
        else if (input.includes('ArrowDown')) this.game.player.setState(states.DIVING,0)
    }

}

export class Falling extends State {
    constructor(game){
        super('FALLING',game)
    }
    enter(){
        this.game.player.frameY = 2
        this.game.player.maxFrame = 6
    }
    handleInput(input){
        // use unshift will remove old particles
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.1, this.game.player.y + this.game.player.height * 0.85))
        if (this.game.player.onGround()) this.game.player.setState(states.RUNNING,1)
        else if (input.includes('Enter')) this.game.player.setState(states.ROLLING,4)
        else if (input.includes('ArrowDown')) this.game.player.setState(states.DIVING,0)
    }
}

export class Rolling extends State {
    constructor(game){
        super('ROLLING',game) 
    }
    enter(){
        if (!this.game.player.onGround()) this.game.player.yspeed += 20
        // else this.game.player.xspeed += 10
        this.game.player.frameY = 6
        this.game.player.maxFrame = 6
    }
    handleInput(input){
        this.game.particles.unshift(new Fire(this.game, this.game.player.x - this.game.player.width * 0.5, this.game.player.y))
        if (!input.includes('Enter') && this.game.player.onGround()) this.game.player.setState(states.RUNNING,1)
        else if (!input.includes('Enter') && !this.game.player.onGround() && this.game.player.yspeed < 0) this.game.player.setState(states.JUMPING,2)
        else if (!input.includes('Enter') && !this.game.player.onGround() && this.game.player.yspeed >= 0) this.game.player.setState(states.FALLING,2)
        else if (input.includes('Enter') && input.includes('ArrowUp') && this.game.player.onGround()) this.game.player.yspeed -= 20
        else if (input.includes('ArrowDown')) this.game.player.setState(states.DIVING,0)
    }
}

export class Diving extends State {
    constructor(game){
        super('DIVING',game) 
    }
    enter(){
        this.game.player.frameX = 0
        this.game.player.maxFrame = 6
        this.game.player.frameY = 6
        this.game.player.yspeed += 20
    }
    handleInput(input){
        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.1, this.game.player.y + this.game.player.height * 0.85))
        if (this.game.player.onGround()) {
            for (let i = 0; i < 30; i++) {
                this.game.particles.unshift(new Splash(this.game, this.game.player.x, this.game.player.y + this.game.player.height / 2))
            }
            this.game.player.setState(states.RUNNING,1)
        }
        else if (input.includes('Enter') && this.game.player.onGround()) this.game.player.setState(states.ROLLING,4)
    }
}

export class Hit extends State {
    constructor(game){
        super('HIT',game) 
    }
    enter(){
        this.game.player.frameX = 0
        this.game.player.maxFrame = 10
        this.game.player.frameY = 4
    }
    handleInput(input){
        if (this.game.player.frameX >= 10 && this.game.player.onGround()){
            this.game.player.setState(states.RUNNING, 1)
        } else if (this.game.player.frameX >= 10 && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 2)
        }
    }
}

