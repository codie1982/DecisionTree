function movePoint(Cumes, moveIndex, point) {
    Cumes[moveIndex].push(point)
    for (let i = 0; i < Cumes.length; i++) {
        if (i != moveIndex) {
            let idx = findPointIndex(Cumes[i], point)
            if (idx != -1) {
                Cumes[i].splice(idx, 1)
            }
        }
    }
}
function isSame(array1, array2) {
    if (array1.length != array2.length) return false;
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] != array2[i]) {
            return false
        }
    }
    return true
}
function cumeCenter(cumePoints) {
    let XTotal = 0
    let YTotal = 0
    for (let i = 0; i < cumePoints.length; i++) {
        XTotal += cumePoints[i].x
        YTotal += cumePoints[i].y
    }
    return { x: (XTotal / cumePoints.length), y: (YTotal / cumePoints.length) }
}

function searchPoint(cume, point) {
    for (let i = 0; i < cume.length; i++) {
        if (cume[i].x == point.x && cume[i].y == point.y) {
            return true
        }
    }
    return false
}
function findPointIndex(cume, point) {
    for (let i = 0; i < cume.length; i++) {
        if (cume[i].x == point.x && cume[i].y == point.y) {
            return i
        }
    }
    return -1
}
function distance(X1, X2) {
    //console.log("object", X1, X2)
    return Math.sqrt(Math.pow((X2.x - X1.x), 2) + Math.pow((X2.y - X1.y), 2))
}

module.exports = {
    distance, findPointIndex, searchPoint, cumeCenter, isSame, movePoint,cumeCentertext
}