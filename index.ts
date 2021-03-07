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


    initCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = BACKGROUND_COLOR 
        this.context.fillRect(0, 0, w, h)
        this.context.fillStyle = 'green'
        this.context.fillText("Hello World", w / 2, h / 2)
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

Stage.init()