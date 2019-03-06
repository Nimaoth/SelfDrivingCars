function lineIntersection(a, b) {
    const d = (a.x0 - a.x1) * (b.y0 - b.y1) - (a.y0 - a.y1) * (b.x0 - b.x1)
    if (d * d < 0.001) {
        return false
    }

    const t1 = (a.x0 - b.x0) * (b.y0 - b.y1) - (a.y0 - b.y0) * (b.x0 - b.x1)
    const t2 = (a.x0 - a.x1) * (a.y0 - b.y0) - (a.y0 - a.y1) * (a.x0 - b.x0)

    const t = t1 / d
    const u = -t2 / d

    if ((t < 0 || t > 1) || (u < 0 || u > 1)) return false

    return true
}

function lineIntersectionPoint(a, b) {
    const d = (a.x0 - a.x1) * (b.y0 - b.y1) - (a.y0 - a.y1) * (b.x0 - b.x1)
    if (d * d < 0.001) {
        return null
    }

    const t1 = (a.x0 - b.x0) * (b.y0 - b.y1) - (a.y0 - b.y0) * (b.x0 - b.x1)
    const t2 = (a.x0 - a.x1) * (a.y0 - b.y0) - (a.y0 - a.y1) * (a.x0 - b.x0)

    const t = t1 / d
    const u = -t2 / d

    if (t < 0 || u < 0 || u > 1) return null

    return t
}

function rotatePoint(angle, x, y, offsetx, offsety) {
    return {
        x: x * cos(angle) - y * sin(angle) + offsetx,
        y: x * sin(angle) + y * cos(angle) + offsety,
    }
}
