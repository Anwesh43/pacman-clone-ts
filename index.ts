const w : number = window.innerWidth 
const h : number = window.innerHeight 
const delay : number = 40 
const PAC_MAN_COLOR : string = "orange"
const BACKGROUND_COLOR : string = "#bdbdbd"
const SPEED : number = 10 
const deg : number = 60 



class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D 
    renderer : Renderer = new Renderer()


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

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
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
    }

    handleKey(cb : Function) {

    }
}

Stage.init()

