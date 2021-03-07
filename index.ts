const w : number = window.innerWidth 
const h : number = window.innerHeight 
const delay : number = 1000
const PAC_MAN_COLOR : string = "orange"
const BACKGROUND_COLOR : string = "#bdbdbd"
const SPEED : number = 10 
const OPENING_SPEED : number = 5 
const MAX_DEG : number = 30 
const PAC_MAN_RFACTOR : number = 12.3 

const toRadians : Function = (deg : number) : number => deg * Math.PI / 180

class DrawingUtil {

    static drawCenteredArc(
        context : CanvasRenderingContext2D,
        cx : number,
        cy : number,
        r : number,
        startDeg : number = 0,
        endDeg : number = 360
    ) {
        context.save()
        context.beginPath()
        context.moveTo(cx, cy)
        for (let j = startDeg; j <= endDeg; j++) {
            const x : number = cx + r * Math.cos(toRadians(j))
            const y : number = cy + r * Math.sin(toRadians(j))
            context.lineTo(x, y)
        }
        context.fill()
        context.restore()
    }
}

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

    private x : number = 0
    private y : number = 0
    private xDir : number = 1 // {1, -1, 0}
    private yDir : number = 0 // {1, -1, 0}
    private angle : number = 0 //{0 >MAX_DEG, MAX_DEG -> 0}
    private dirAngle : number = 0  // {0, 180, 270, 90}
    private openingDir : number = 1 //{1, -1} 

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

    render(cb : Function) {
        cb(this.x, this.y, this.angle, this.dirAngle)
    }
}

class PacMan {

    state : PacmanState = new PacmanState()
    
    draw(context : CanvasRenderingContext2D) {
        const pacManRadius : number = Math.min(w, h) / PAC_MAN_RFACTOR
        context.fillStyle = PAC_MAN_COLOR
        this.state.render((x : number, y : number, angle : number, dirAngle : number) => {
            context.save()
            context.translate(x, y)
            context.rotate(dirAngle)
            DrawingUtil.drawCenteredArc(context, 0, 0, pacManRadius, angle, 360 - angle)
            context.restore()
        })
    } 

    move() {
       this.state.move() 
    }

    toLeft() {
        this.state.toLeft()
    }

    toRight() {
        this.state.toRight()
    }

    toDown() {
        this.state.toDown()
    }

    toUp() {
        this.state.toUp()
    }

} 

Stage.init()

