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

function KNN(Cumes, point, K = 5) {
    let min;
    let KPoint;
    let index;
    let distObj = []
    for (let i = 0; i < Cumes.length; i++) {
        for (let j = 0; j < Cumes[i].length; j++) {
            if (typeof min == "undefined") min = distance(Cumes[i][j], point)
            if (min > distance(Cumes[i][j], point)) {
                min = distance(Cumes[i][j], point)
                index = i
                KPoint = Cumes[i]

            }
            distObj.push({ min, i, j, KPoint })
        }
    }
    distObj.sort((a, b) => (a.min > b.min) ? 1 : -1)

    let KK = []
    let count = 1
    for (let s = 0; s < K; s++) {
        let _idx = KK.findIndex(item => item.i == distObj[s].i)
        if (_idx != -1) {
            //güncelle
            KK[_idx].count++
        } else {
            //yeni değer oluştur
            KK.push({ i: distObj[s].i, count })
        }
    }

    let KKSORT = KK.sort((a, b) => (a.count > b.count) ? 1 : -1)
    console.table(KKSORT)
    let _KKSORT = KKSORT[KKSORT.length - 1]
    return {
        min_distance: min, Kindex: _KKSORT.i, KPoint: distObj[_KKSORT.i].KPoint,
    }
}
module.exports = {
    distance, findPointIndex, searchPoint, cumeCenter, isSame, movePoint,KNN
}