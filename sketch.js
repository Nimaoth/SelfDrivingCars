let track = [{"x0":285,"y0":516,"x1":133,"y1":525},{"x0":133,"y0":525,"x1":84,"y1":492},{"x0":84,"y0":492,"x1":73,"y1":431},{"x0":73,"y0":431,"x1":95,"y1":355},{"x0":95,"y0":355,"x1":130,"y1":284},{"x0":130,"y0":284,"x1":119,"y1":227},{"x0":119,"y0":227,"x1":75,"y1":165},{"x0":75,"y0":165,"x1":113,"y1":83},{"x0":113,"y0":83,"x1":176,"y1":69},{"x0":176,"y0":69,"x1":311,"y1":88},{"x0":311,"y0":88,"x1":414,"y1":146},{"x0":414,"y0":146,"x1":431,"y1":226},{"x0":431,"y0":226,"x1":399,"y1":268},{"x0":399,"y0":268,"x1":340,"y1":287},{"x0":340,"y0":287,"x1":331,"y1":342},{"x0":331,"y0":342,"x1":380,"y1":371},{"x0":380,"y0":371,"x1":456,"y1":408},{"x0":456,"y0":408,"x1":470,"y1":479},{"x0":470,"y0":479,"x1":415,"y1":533},{"x0":415,"y0":533,"x1":283,"y1":516},{"x0":258,"y0":152,"x1":335,"y1":179},{"x0":335,"y0":179,"x1":351,"y1":224},{"x0":351,"y0":224,"x1":306,"y1":250},{"x0":306,"y0":250,"x1":271,"y1":301},{"x0":271,"y0":301,"x1":275,"y1":362},{"x0":275,"y0":362,"x1":321,"y1":416},{"x0":321,"y0":416,"x1":387,"y1":454},{"x0":387,"y0":454,"x1":349,"y1":460},{"x0":349,"y0":460,"x1":253,"y1":445},{"x0":253,"y0":445,"x1":185,"y1":463},{"x0":185,"y0":463,"x1":144,"y1":426},{"x0":144,"y0":426,"x1":180,"y1":353},{"x0":180,"y0":353,"x1":217,"y1":264},{"x0":217,"y0":264,"x1":158,"y1":180},{"x0":158,"y0":180,"x1":186,"y1":146},{"x0":186,"y0":146,"x1":258,"y1":153}]
let goals = [{"x0":243,"y0":157,"x1":255,"y1":71},{"x0":267,"y0":160,"x1":289,"y1":76},{"x0":284,"y0":166,"x1":331,"y1":93},{"x0":313,"y0":177,"x1":359,"y1":106},{"x0":330,"y0":186,"x1":395,"y1":128},{"x0":334,"y0":200,"x1":427,"y1":178},{"x0":340,"y0":217,"x1":433,"y1":217},{"x0":339,"y0":222,"x1":411,"y1":257},{"x0":326,"y0":232,"x1":388,"y1":278},{"x0":305,"y0":243,"x1":347,"y1":287},{"x0":283,"y0":269,"x1":341,"y1":305},{"x0":268,"y0":314,"x1":342,"y1":317},{"x0":264,"y0":343,"x1":334,"y1":330},{"x0":280,"y0":375,"x1":344,"y1":343},{"x0":304,"y0":401,"x1":363,"y1":351},{"x0":331,"y0":427,"x1":393,"y1":370},{"x0":362,"y0":441,"x1":429,"y1":391},{"x0":375,"y0":452,"x1":465,"y1":433},{"x0":369,"y0":452,"x1":473,"y1":477},{"x0":366,"y0":454,"x1":430,"y1":527},{"x0":354,"y0":455,"x1":362,"y1":527},{"x0":320,"y0":447,"x1":292,"y1":521},{"x0":242,"y0":439,"x1":246,"y1":525},{"x0":191,"y0":456,"x1":168,"y1":528},{"x0":172,"y0":436,"x1":89,"y1":503},{"x0":160,"y0":425,"x1":73,"y1":417},{"x0":172,"y0":395,"x1":95,"y1":361},{"x0":200,"y0":336,"x1":100,"y1":299},{"x0":225,"y0":276,"x1":114,"y1":252},{"x0":187,"y0":203,"x1":63,"y1":206},{"x0":189,"y0":164,"x1":74,"y1":114},{"x0":194,"y0":148,"x1":152,"y1":66}]


let civ = new Array(10)

let gen = 1

let lastFps = []
let timer = 0

let nnLayers = [11, 20, 10, 5, 2]

let p1 = null

let iterationSlider
let maxTimeSlider

let bestScore = 0

let lastMouseX = 0
let lastMouseY = 0
let hasLastMouse = false

const MODE_NONE = "None"
const MODE_CREATE_TRACK = "Create Track"
const MODE_CREATE_GOALS = "Create Goals"
const MODE_RUN_SIMULATION = "Run Simulation"
const MODE_SET_START = "Set Start"
const MODE_GRAPHS = "Graphs"

let mode = MODE_RUN_SIMULATION

let startPosition

let highscores = []

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function keyTyped() {
    if (key === 'r') {
        mode = MODE_RUN_SIMULATION

        for (let c of civ) {
            c.car.pos.set(startPosition.x, startPosition.y)
            c.car.vel.set(0, 0)
            c.car.force.set(0, 0)
            c.car.rot = 0
            c.currentGoal = 0
        }
    } else if (key === 'm') {
        mode = MODE_CREATE_TRACK
    } else if (key === 'g') {
        mode = MODE_CREATE_GOALS
    } else if (key === 'x') {
        mode = MODE_NONE
    } else if (key === 'c') {
        timer = 0
        bestScore = 0
        track = []
        goals = []
        highscores = []
        gen = 1
    } else if (key === 'p') {
        mode = MODE_SET_START
    } else if (key === 'z') {
        if (mode === MODE_CREATE_TRACK) track.pop()
        if (mode === MODE_CREATE_GOALS) goals.pop()
    } else if (key === 'h') {
        mode = MODE_GRAPHS
    }
}

function mousePressed() {
    if (mode === MODE_CREATE_GOALS) {
        hasLastMouse = true
    }

    if (mode === MODE_SET_START) {
        if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
            startPosition.x = mouseX
            startPosition.y = mouseY
        }
    }

    lastMouseX = mouseX
    lastMouseY = mouseY
}

function mouseReleased() {
    if (mode === MODE_CREATE_TRACK) {
        track.push({ x0: lastMouseX, y0: lastMouseY, x1: mouseX, y1: mouseY })
    }
    if (mode === MODE_CREATE_GOALS) {
        goals.push({ x0: lastMouseX, y0: lastMouseY, x1: mouseX, y1: mouseY })
        hasLastMouse = false
    }
}

function mouseDragged() {
    if (mode === MODE_CREATE_TRACK) {
        if (pow(mouseX - lastMouseX, 2) + pow(mouseY - lastMouseY, 2) > pow(25, 2)) {
            track.push({ x0: lastMouseX, y0: lastMouseY, x1: mouseX, y1: mouseY })
            lastMouseX = mouseX
            lastMouseY = mouseY
        }
    }
}

function setup() {
    createCanvas(700, 600)

    startPosition = { x: 200, y: 110 }

    for (let i = 0; i < civ.length; i++) {
        civ[i] = {
            controller: new NeuralNet(nnLayers, () => random() * 2 - 1),
            car: new Car(startPosition)
        }
    }

    // civ[0].controller.setLayers(bestController)

    iterationSlider = createSlider(1, 20, 5, 1)
    iterationSlider.position(width - 250, 20)
    maxTimeSlider = createSlider(10, 120, 60, 1)
    maxTimeSlider.position(width - 250, 50)

    const dm = document.getElementById("download_map")
    dm.addEventListener("click", () => download("map.json", JSON.stringify({
        startPosition,
        track,
        goals
    })))

    const dbc = document.getElementById("download_best_car")
    dbc.addEventListener("click", () => download("controller.json", JSON.stringify(civ[0].controller.layers)))

    const load_map = document.getElementById("load_map")
    const upload_map = document.getElementById("upload_map")
    upload_map.addEventListener("click", () => {
        var file = load_map.files[0];
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                const json = JSON.parse(evt.target.result);
                startPosition = json.startPosition
                track = json.track
                goals = json.goals
            }
            reader.onerror = function (evt) {
                alert("failed to upload file")
            }
        }
    })
}


function draw() {
    background(50)

    if (frameRate() === 0) return

    lastFps.push(frameRate())
    if (lastFps.length > 25) {
        lastFps.shift()
    }

    let fps = lastFps.reduce((a, b) => a + b, 0)

    noStroke()
    textSize(20)
    fill(255)
    text(" FPS: " + floor(fps / lastFps.length), 10, 30)
    text("Time: " + floor(timer) + " / " + maxTimeSlider.value(), 10, 60)
    text(" Gen: " + gen, 10, 90)
    text(" IPF: " + iterationSlider.value(), 10, 120)
    text("Best: " + bestScore, 10, 150)
    text("Simulation Speed", iterationSlider.x + iterationSlider.width, iterationSlider.y + 10);
    text("max time", maxTimeSlider.x + maxTimeSlider.width, maxTimeSlider.y + 10);
    text(mode, 200, 30)
    stroke(255)


    // control
    const t = 1 / frameRate()

    // car stuff
    if (mode === MODE_RUN_SIMULATION) {
        // rendern track
        stroke(255)
        for (let l of track) {
            line(l.x0, l.y0, l.x1, l.y1)
        }
    
        // rendern goals
        stroke(0, 255, 0)
        for (let l of goals) {
            line(l.x0, l.y0, l.x1, l.y1)
        }
        stroke(255)

        for (let iter = 0; iter < iterationSlider.value(); iter++) {
            iterate(t)
        }

        for (let i = 0; i < civ.length; i++) {
            let car = civ[i].car
            car.render()
        }

        // render stats of best car
        noStroke()
        text(" acc: ", 10, height - 40)
        text("turn: ", 10, height - 20)
    
        fill(255, 0, 0)
        renderBar(60, height - 50, 100, 10, civ[0].controller.getOutput(0) * 0.5 + 0.5)
        fill(0, 255, 0)
        renderBar(60, height - 30, 100, 10, civ[0].controller.getOutput(1) * 0.5 + 0.5)
    } else if (mode === MODE_CREATE_GOALS) {
        // rendern track
        stroke(255)
        for (let l of track) {
            line(l.x0, l.y0, l.x1, l.y1)
        }
    
        // rendern goals
        stroke(0, 255, 0)
        for (let l of goals) {
            line(l.x0, l.y0, l.x1, l.y1)
        }
        stroke(255)

        if (hasLastMouse) {
            stroke(0, 255, 0)
            line(lastMouseX, lastMouseY, mouseX, mouseY)
        }
    } else if (mode === MODE_CREATE_TRACK) {
        // rendern track
        stroke(255)
        for (let l of track) {
            line(l.x0, l.y0, l.x1, l.y1)
        }
    
        // rendern goals
        stroke(0, 255, 0)
        for (let l of goals) {
            line(l.x0, l.y0, l.x1, l.y1)
        }
        stroke(255)

        if (mouseIsPressed) {
            stroke(255)
            line(lastMouseX, lastMouseY, mouseX, mouseY)
        }
    } else if (mode === MODE_SET_START) {
        // rendern track
        stroke(255)
        for (let l of track) {
            line(l.x0, l.y0, l.x1, l.y1)
        }
    
        // rendern goals
        stroke(0, 255, 0)
        for (let l of goals) {
            line(l.x0, l.y0, l.x1, l.y1)
        }
        stroke(255)

        fill(0, 0, 255)
        ellipse(startPosition.x, startPosition.y, 15)
    } else if (mode === MODE_GRAPHS) {
        const m = highscores.reduce((a, b) => a > b ? a : b, 0)
        drawGraph(highscores, 100, 100, width - 200, height - 200, 1 / m)
    }
}

function drawGraph(values, x, y, w, h, s) {
    noFill()
    stroke(255)
    beginShape()
    for (let i = 0; i < values.length; i++) {
        vertex(x + i * (w / values.length), y + w - values[i] * s * h)
    }
    endShape()
}

function iterate(t) {
    let done = true
    for (let i = 0; i < civ.length; i++) {
        let controller = civ[i].controller
        let car = civ[i].car

        if (car.dead) continue

        let sensorValues = car.getSensorValues();
        sensorValues.push(1)
        controller.setInputArray(sensorValues)
        controller.update()

        car.update(controller.getOutput(0) * 0.5 + 0.5, controller.getOutput(1), t)
        car.collide(track, goals)

        done &= car.dead
    }

    timer += t

    if (done || timer > maxTimeSlider.value()) {
        // next generation
        timer = 0
        gen += 1
        let newGen = new Array(civ.length)

        // order cars by current goal
        civ.sort((a, b) => b.car.currentGoal - a.car.currentGoal)
        let total = civ.reduce((a, c) => a + c.car.currentGoal, 0)
        if (total == 0) {
            for (let i = 0; i < newGen.length; i++) {
                newGen[i] = {
                    controller: new NeuralNet(nnLayers, () => random() * 2 - 1),
                    car: new Car(startPosition)
                }
            }
        } else {
            highscores.push(civ[0].car.currentGoal)
            bestScore = max(bestScore, civ[0].car.currentGoal)
            let chances = civ.map(c => c.car.currentGoal / total)

            for (let i = 0; i < newGen.length; i++) {
                // select two parents
                function selectParent() {
                    let r = random()
                    let sum = 0
                    for (let k = 0; k < chances.length; k++) {
                        sum += chances[k]
                        if (sum > r) {
                            return k
                        }
                    }
                    return 0
                }

                let p1 = selectParent()
                let p2 = 0
                for (let k = 0; k < 5; k++) {
                    p2 = selectParent()
                    if (p1 !== p2) break
                }

                // bread child
                newGen[i] = {
                    controller: new NeuralNet(nnLayers, () => random() * 2 - 1),
                    car: new Car(startPosition)
                }

                if (i === 0) {
                    newGen[i].controller = civ[i].controller
                }
                else if (i < newGen.length * 0.8) {
                    newGen[i].controller.setParents(civ[p1].controller, civ[p2].controller, 0.2)
                    newGen[i].car.setParents(civ[p1].car, civ[p2].car, 10)
                }
            }
        }
        civ = newGen
    }
}

function renderBar(x, y, w, h, percentage) {
    push()
    rectMode(CORNER)
    noStroke()
    rect(x, y, percentage * w, h)
    noFill()
    stroke(255)
    rect(x, y, w, h)
    pop()
}
