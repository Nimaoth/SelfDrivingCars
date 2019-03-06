
class Car {
    constructor(startPosition) {
        this.pos = createVector(startPosition.x, startPosition.y)
        this.vel = createVector(0, 0)
        this.force = createVector(0, 0)
        this.rot = 0
        this.width = 12
        this.height = 7
        this.turnSpeed = PI * 0.9
        this.damping = 2
        this.gas = 300
        this.currentGoal = 0
        this.color = random(100)

        this.sensors = [
            { a: radians(0 * 2), hit: 0 },

            { a: radians(10 * 2), hit: 0 },
            { a: radians(20 * 2), hit: 0 },
            { a: radians(30 * 2), hit: 0 },

            { a: radians(-10 * 2), hit: 0 },
            { a: radians(-20 * 2), hit: 0 },
            { a: radians(-30 * 2), hit: 0 },

            { a: radians(90), hit: 0 },
            { a: radians(-90), hit: 0 },

            { a: radians(180), hit: 0 },
        ]

        this.dead = false
    }

    update(drive, turn, t) {
        this.rot += turn * this.turnSpeed * t

        let acc = createVector(this.force.x, this.force.y)

        // damping
        acc.add(p5.Vector.mult(this.vel, -this.damping))

        // gas pedal
        acc.add(createVector(cos(this.rot) * this.gas * drive, sin(this.rot) * this.gas * drive))

        // integrate
        this.vel.add(p5.Vector.mult(acc, t))
        this.pos.add(p5.Vector.mult(this.vel, t))
        this.force.set(0, 0)
    }

    collide(track, goals) {
        this.dead = false

        let c1 = rotatePoint(this.rot, this.width * 0.5, this.height * 0.5, this.pos.x, this.pos.y)
        let c2 = rotatePoint(this.rot, this.width * 0.5, -this.height * 0.5, this.pos.x, this.pos.y)
        let c3 = rotatePoint(this.rot, -this.width * 0.5, -this.height * 0.5, this.pos.x, this.pos.y)
        let c4 = rotatePoint(this.rot, -this.width * 0.5, this.height * 0.5, this.pos.x, this.pos.y)
        for (let l of track) {
            this.dead |= ( lineIntersection(l, { x0: c1.x, y0: c1.y, x1: c2.x, y1: c2.y })
                        || lineIntersection(l, { x0: c2.x, y0: c2.y, x1: c3.x, y1: c3.y })
                        || lineIntersection(l, { x0: c3.x, y0: c3.y, x1: c4.x, y1: c4.y })
                        || lineIntersection(l, { x0: c4.x, y0: c4.y, x1: c1.x, y1: c1.y }))
        }

        if (goals.length > 0) {
            let goal = goals[this.currentGoal % goals.length]
            if (   lineIntersection(goal, { x0: c1.x, y0: c1.y, x1: c2.x, y1: c2.y })
                || lineIntersection(goal, { x0: c2.x, y0: c2.y, x1: c3.x, y1: c3.y })
                || lineIntersection(goal, { x0: c3.x, y0: c3.y, x1: c4.x, y1: c4.y })
                || lineIntersection(goal, { x0: c4.x, y0: c4.y, x1: c1.x, y1: c1.y })) {
                this.currentGoal++
            }
        }

        // sensors
        for (let s of this.sensors) {
            const p = rotatePoint(s.a + this.rot, 1, 0, this.pos.x, this.pos.y)

            let min = null
            for (let l of track) {
                const d = lineIntersectionPoint({ x0: this.pos.x, y0: this.pos.y, x1: p.x, y1: p.y }, l)
                if (min === null || d !== null && d < min) {
                    min = d
                }
            }

            s.hit = min
        }
    }

    render() {
        // render car
        colorMode(HSB, 100)

        push()
        translate(this.pos.x, this.pos.y)
        rotate(this.rot)
        rectMode(CENTER)

        if (this.dead) stroke(255, 0, 0)
        fill(this.color % 100, 100, 100)
        rect(0, 0, this.width, this.height)
        stroke(255)
        pop()

        strokeWeight(1)
        fill((this.color + 50) % 100, 100, 100)
        noStroke()
        text(this.currentGoal + "", this.pos.x - 5, this.pos.y + 10)
        fill(255)
        stroke(255)

        colorMode(RGB)
        
        // // render sensors
        // for (let s of this.sensors) {
        //     if (s.hit !== null) {
        //         const p = rotatePoint(s.a + this.rot, s.hit, 0, this.pos.x, this.pos.y)
        //         line(this.pos.x, this.pos.y, p.x, p.y)
        //     }
        //     else
        //     {
        //         const p = rotatePoint(s.a + this.rot, 1000, 0, this.pos.x, this.pos.y)
        //         line(this.pos.x, this.pos.y, p.x, p.y)
        //     }
        // }
    }

    getSensorValues() {
        return this.sensors.map(s => s.hit === null ? 1000 : s.hit)
    }

    setParents(p1, p2, rand) {
        this.color = (p1.color + p2.color) * 0.5 + random(rand)
    }
}
