import './style.css'

const canvas = document.getElementById('paint') as HTMLCanvasElement
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

if (ctx) {
    ctx.lineWidth = 24
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#01161E'
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    if (ctx) {
        ctx.lineWidth = 24
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
    }
})

let isDrawing = false
let restore: {
    index: number,
    memory: ImageData[]
} = {
    index: -1,
    memory: []
}

let coord = {
    x: 0,
    y:0 
}

const getMouseCoordinates = (e: MouseEvent) => {
    coord['x'] = e.pageX - canvas.offsetLeft
    coord['y'] = e.pageY - canvas.offsetTop
    isDrawing = true
}

const getTouchCoordinates = (e: TouchEvent) => {
    coord['x'] = e.touches[0].pageX - canvas.offsetLeft
    coord['y'] = e.touches[0].pageY - canvas.offsetTop
    isDrawing = true
}

const drawWithMouse = (e: MouseEvent) => {
    if (!isDrawing) return

    ctx?.beginPath()
    ctx?.moveTo(coord.x, coord.y)
    getMouseCoordinates(e)
    ctx?.lineTo(coord.x, coord.y)
    ctx?.stroke()
}

const drawWithTouch = (e: TouchEvent) => {
    if (!isDrawing) return

    ctx?.beginPath()
    ctx?.moveTo(coord.x, coord.y)
    getTouchCoordinates(e)
    ctx?.lineTo(coord.x, coord.y)
    ctx?.stroke()
}

const endDrawing = (e: MouseEvent | TouchEvent) => {
    if (isDrawing) {
        ctx?.closePath()
        isDrawing = false
    }
    if (e.type !== 'mouseout') {
        restore.memory.push(ctx!.getImageData(0, 0, canvas.width, canvas.height))
        restore.index++
    }
}

canvas.addEventListener('touchstart', getTouchCoordinates)
canvas.addEventListener('touchmove', drawWithTouch)
canvas.addEventListener('touchend', endDrawing)

canvas.addEventListener('mousedown', getMouseCoordinates)
canvas.addEventListener('mousemove', drawWithMouse)
canvas.addEventListener('mouseup', endDrawing)
canvas.addEventListener('mouseout', endDrawing)

const undo = () => {
    if (restore.index <= 0) {
        clear()
    } else {
        restore.index--
        restore.memory.pop()
        ctx?.putImageData(restore.memory[restore.index], 0, 0)
    }
}

document.getElementById('undo')?.addEventListener('click', undo)

const clear = () => {
    if (restore.index <= -1) {
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
    } else {
        ctx!.fillStyle = 'white'
        ctx?.clearRect(0, 0, canvas.width, canvas.height)
        ctx?.fillRect(0, 0, canvas.width, canvas.height)
        restore = {
            index: -1,
            memory: []
        }
    }
}

document.getElementById('clear')?.addEventListener('click', clear)

const defaultColors = [
    '#01161E', '#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93'
]
const colors = document.querySelectorAll('.color')
colors.forEach((button, idx) => {
    (button as HTMLElement).style.backgroundColor = defaultColors[idx]

    button.addEventListener('click', () => {
        ctx!.strokeStyle = defaultColors[idx]
    })
})

const cursor = document.getElementById('cursor') as HTMLImageElement

document.addEventListener('mousemove', (e: MouseEvent) => {
    cursor.style.left = `${e.pageX}px`
    cursor.style.top = `${e.pageY - cursor.height}px`

    if (e.pageX > canvas.width - cursor.width || e.pageY < cursor.height) {
        cursor.style.transform = `rotate(180deg) translateY(-${cursor.height}px) translateX(${cursor.width}px)`
    } else {
        cursor.style.transform = 'none'
    }
})

const resetDiv = document.getElementById('reset-div') as HTMLDivElement
const controlsDiv = document.getElementById('controls-div') as HTMLDivElement

const showCursor = () => cursor.style.display = 'block'
const hideCursor = () => cursor.style.display = 'none'

resetDiv.addEventListener('mouseenter', hideCursor)
resetDiv.addEventListener('mouseleave', showCursor)
controlsDiv.addEventListener('mouseenter', hideCursor)
controlsDiv.addEventListener('mouseleave', showCursor)