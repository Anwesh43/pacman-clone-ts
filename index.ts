const w : number = window.innerWidth 
const h : number = window.innerHeight 
const delay : number = 1000
const PAC_MAN_COLOR : string = "orange"
const BACKGROUND_COLOR : string = "#bdbdbd"
const SPEED : number = 10 
const OPENING_SPEED : number = 5 
const MAX_DEG : number = 30 

const toRadians : Function = (deg : number) : number => deg * Math.PI / 180

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D 
    renderer : Renderer = new Renderer()
    loop : Loop = new Loop()


    initCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = BACKGROUND_COLOR 
        this.context.fillRect(0, 0, w, h)
        this.renderer.render(this.context)
    }

    handleKeyDown() {
        window.onkeydown = (e) => {

        }
    }

    start() {
        this.loop.start(() => {
            this.render()
        })
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.start()
        stage.handleKeyDown()
    }
    
}

class Renderer {

    k : number = 0 

    render(context : CanvasRenderingContext2D) {
        context.font = context.font.replace(/\d+/g, '100')
        const text : string = `Hello:${this.k}`
        context.fillStyle = 'green'
        const {width : tw} = context.measureText(text) //{width : } ->> tw 
        context.fillText(text, w / 2 - tw / 2, h / 2)
        this.k++;
    }

    handleKey(cb : Function) {

    }

}

class Loop {
    
    interval : number 
    running : boolean 

    start(cb : Function) {
        if (!this.running) {
            this.running = true 
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.running) {
            this.running = false 
            clearInterval(this.interval)
        }
    }
}

class PacmanState {

    x : number = 0
    y : number = 0
    xDir : number = 1 // {1, -1, 0}
    yDir : number = 0 // {1, -1, 0}
    angle : number = 0 //{0 >MAX_DEG, MAX_DEG -> 0}
    dirAngle : number = 0  // {0, 180, 270, 90}
    openingDir : number = 1 //{1, -1} 

    move() {
        this.x += this.xDir * SPEED 
        this.y += this.yDir * SPEED
        this.angle += this.openingDir * OPENING_SPEED
        if (this.angle >= MAX_DEG) {
            this.openingDir = -1
        } else if (this.angle <= 0) {
            this.openingDir = 1
        }
    }

    getDirAngle() {
        return toRadians(this.dirAngle) 
    }

    getAngle() {
        return this.angle
    }

    toLeft() {
        this.dirAngle = 180 
        this.xDir = -1 
        this.yDir = 0
    }

    toRight() {
        this.dirAngle = 0 
        this.xDir = 1
        this.yDir = 0
    }

    toUp() {
        this.dirAngle = 270 
        this.xDir = 0 
        this.yDir = -1
    }

    toDown() {
        this.dirAngle = 90 
        this.xDir = 0 
        this.yDir = 1
    }
}

Stage.init()

