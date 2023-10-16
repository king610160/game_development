export default class InputHandler {
    constructor() {
        this.lastKey = ''
        // use arrow function to bind to this.lastKey, or use bind method
        window.addEventListener('keydown', (e) => {
            console.log(e.key)
            switch(e.key){
                case 'ArrowLeft':
                    this.lastKey = 'Press left'
                    break
                case 'ArrowRight':
                    this.lastKey = 'Press right'
                    break
                case 'ArrowDown':
                    this.lastKey = 'Press down'
                    break
                case 'ArrowUp':
                    this.lastKey = 'Press up'
                    break
            }
        })
        window.addEventListener('keyup', (e) => {
            switch(e.key){
                case 'ArrowLeft':
                    this.lastKey = 'Release left'
                    break
            }
            switch(e.key){
                case 'ArrowRight':
                    this.lastKey = 'Release right'
                    break
            }
            switch(e.key){
                case 'ArrowDown':
                    this.lastKey = 'Release down'
                    break
            }
            switch(e.key){
                case 'ArrowUp':
                    this.lastKey = 'Release up'
                    break
            }
        })
    }
}