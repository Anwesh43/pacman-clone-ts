const w : number = window.innerWidth * 0.8 
const h : number = window.innerHeight * 0.8 
const delay : number = 20
const PAC_MAN_COLOR : string = "#f1c40f"
const BACKGROUND_COLOR : string = "#212121"
const SPEED : number = 2 
const OPENING_SPEED : number = 1 
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
        window.onkeydown = (e : KeyboardEvent) => {
            this.renderer.handleKey(e.code)
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

    pacMan : PacMan = new PacMan()

    render(context : CanvasRenderingContext2D) {
        this.pacMan.draw(context)
        this.pacMan.move()
    }

    handleKey(code : string) {
        const codeFnMap : Record<string, Function> = {
            "ArrowUp": () => {
                this.pacMan.toUp()
            },
            "ArrowDown": () => {
                this.pacMan.toDown()
            },
            "ArrowLeft": () => {
                this.pacMan.toLeft()
            },
            "ArrowRight": () => {
                this.pacMan.toRight()
            }
        };
        if (code in codeFnMap) {
            codeFnMap[code]()
        } else {
            console.log("Plese enter key up, right, left or down")
        }

    }

}

class Timer {
    
    curr : Date 
    totalDiff : number = 0
    start() {
        this.curr = new Date()
        console.log(`started at ${this.curr.toLocaleDateString()}`)
    }


    check() {
        const curr = new Date()
        const diff : number = curr.getTime() - this.curr.getTime()
        this.curr = curr 
        this.totalDiff += diff
        return diff
    }

    shouldRender() :  Boolean {
        const result : Boolean = this.totalDiff >= delay 
        if (result) {
            this.totalDiff = 0 
        }
        return result 
    }

}

class Loop {
    
    interval : number 
    running : boolean 
    timer : Timer = new Timer()

    start(cb : Function) {
        if (!this.running) {
            this.running = true 
            this.timer.start()
            this.loop(cb)

        }
    }

    loop(cb : Function) {
        if (this.running) {
            const diff : number = this.timer.check()
            cb()
            requestAnimationFrame(() => {
                this.loop(cb)
            })
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

    private x : number = w / 20
    private y : number = h / 2
    private xDir : number = 1 // {1, -1, 0}
    private yDir : number = 0 // {1, -1, 0}
    private angle : number = 0 //{0 >MAX_DEG, MAX_DEG -> 0}
    private dirAngle : number = 0  // {0, 180, 270, 90}
    private openingDir : number = 1 //{1, -1} 
    private pacManRadius : number = Math.min(w, h) / PAC_MAN_RFACTOR

    move() {
        this.x += this.xDir * SPEED 
        this.y += this.yDir * SPEED
        this.angle += this.openingDir * OPENING_SPEED
        if (this.x > w + this.pacManRadius) {
            this.x = -this.pacManRadius
        }
        if (this.x < -this.pacManRadius) {
            this.x = w + this.pacManRadius 
        }
        if (this.y > h + this.pacManRadius) {
            this.y = -this.pacManRadius 
        }
        if (this.y < -this.pacManRadius) {
            this.y = h + this.pacManRadius
        }
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
        cb(this.x, this.y, this.angle, this.dirAngle, this.pacManRadius)
    }
}

class PacMan {

    state : PacmanState = new PacmanState()
    
    draw(context : CanvasRenderingContext2D) {
        context.fillStyle = PAC_MAN_COLOR
        this.state.render((x : number, y : number, angle : number, dirAngle : number, pacManRadius : number) => {
            context.save()
            context.translate(x, y)
            context.rotate(toRadians(dirAngle))
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

