import Player from "./player.js"
import InputHandler from "./input.js"
import { Background } from "./background.js"
import { FlyingEnemy, GroundEnemy, ClimbingEnemy} from './enemy.js'
import UI from './UI.js'


window.addEventListener('load', function(){
    const canvas = this.document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = 900
    canvas.height = 500

    class Game {
        constructor(width, height){
            this.width = width
            this.height = height
            this.groundMargin = 80
            this.gameSpeed = 0 // initial speed is 0
            this.maxGameSpeed = 3
            this.player = new Player(this)
            this.input = new InputHandler(this)
            this.background = new Background(this)
            this.ui = new UI(this)
            this.enemies = []
            this.particles = []
            this.maxParticles = 200
            this.collisions = []
            this.floatingMessages = []
            this.enemyTimer = 0
            this.enemyInterval = 1000 // add per second
            this.debug = false
            this.score = 0
            this.lives = 10
            this.time = 0
            this.maxTime = 20 * 1000
            this.gameOver = false
            this.fontColor = 'black'
            this.player.currentState = this.player.states[0] // need to put at here, for in player.js, game may not fully loaded
            this.player.currentState.enter()
        }
        addEnemy(){
            this.enemies.push(new FlyingEnemy(this))
            if (this.gameSpeed > 0 && Math.random() < 0.5)this.enemies.push(new GroundEnemy(this))
            this.enemies.push(new ClimbingEnemy(this))
        }
        update(deltaTime){
            // count to end the game
            this.time += deltaTime
            if (this.time > this.maxTime) this.gameOver = true

            // filter out all dead things
            this.enemies = this.enemies.filter(enemy => !enemy.dead)
            this.particles = this.particles.filter(particle => !particle.dead)
            this.collisions = this.collisions.filter(collision => !collision.dead)
            this.floatingMessages = this.floatingMessages.filter(floatingMessage => !floatingMessage.dead)

            if (this.particles.length > 50) this.particles.length = this.maxParticles
            this.background.update()
            this.player.update(this.input.keys, deltaTime)

            // handle enemies
            if (this.enemyTimer > this.enemyInterval){
                this.addEnemy()
                this.enemyTimer = 0
            }
            this.enemyTimer += deltaTime            
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime)
            })
            // handle particle
            this.particles.forEach(particle => {
                particle.update()
            })
            // handle collision
            this.collisions.forEach(collision => {
                collision.update(deltaTime)
            })

            // handle word from collision
            this.floatingMessages.forEach(floatingMessage => {
                floatingMessage.update()
            })

        }
        draw(context){
            this.background.draw(context)
            this.enemies.forEach(enemy => {
                enemy.draw(context)
            })
            this.particles.forEach(particle => {
                particle.draw(context)
            })
            this.collisions.forEach(collision => {
                collision.draw(context)
            })
            this.floatingMessages.forEach(floatingMessage => {
                floatingMessage.draw(context)
            })
            this.player.draw(context)
            this.ui.draw(context)
        } 
    }

    const game = new Game(canvas.width, canvas.height)    
    let lastTime = 0

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0,0,canvas.width,canvas.height)
        game.update(deltaTime)
        game.draw(ctx)
        if (!game.gameOver) requestAnimationFrame(animate)
        // else 
    }
    animate(0)
})