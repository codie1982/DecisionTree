"use strict"
//Selamlar Aşapıdaki örnek ile sağlamasını yapabilirsin.
//Engin EROL
//https://erdincuzun.com/makine_ogrenmesi/k-nn-algoritmasi/
let iterasyon = 0
let wait = 0
let waitStop = 2
let itr = true

let data = []
for (let i = 0; i < 10; i++) {
    data.push({ x: (Math.random() * 100), y: (Math.random() * 100) })
}
console.table(data)
/* const data = [
    { x: 1, y: 1 },
    { x: 1.5, y: 2 },
    { x: 3, y: 4 },
    { x: 5, y: 7 },
    { x: 3.5, y: 5 },
    { x: 4.5, y: 5 },
    { x: 3.5, y: 4.5 },
] */
const K = 2
//center sayısı K değeri dir
let Cumes = []
for (let i = 0; i < K; i++) {
    Cumes.push([{ x: (Math.random() * 100), y: (Math.random() * 100) }])
}

/* const Cumes = [
    [
        { x: (Math.random() * 10), y: (Math.random() * 10) },
    ]
    ,
    [
        { x: (Math.random() * 10), y: (Math.random() * 10) }
    ]
] */

let nCumeCounts = []
console.time("KMeans")
while (itr) {
    let oCumeCounts = []
    console.log("Iterasyon Sayısı", iterasyon)
    for (let i = 0; i < data.length; i++) {
        let D = []
        let _D = []
        for (let k = 0; k < K; k++) {
            //Kume merkezini hesapla
            let _cumeCenter = cumeCenter(Cumes[k])
            for (let j = 0; j < Cumes[k].length; j++) {
                let diff = distance(_cumeCenter, data[i])
                D.push(diff)
                _D.push({ data: data[i], dataIndex: i, cumes: Cumes[k][j], cumeIndex: j, diff, KIndex: k, K: k + 1, _cumeCenter })
            }
        }
        //console.log(`_D : `, _D)
        let minDis = _D.find(item => item.diff == D.sort()[0])
        //console.log("En Küçük Mesafe : ", minDis)
        if (typeof minDis != "undefined")
            if (!searchPoint(Cumes[minDis.KIndex], minDis.data)) {
                movePoint(Cumes, minDis.KIndex, minDis.data)
            }
    }
    
    for (let c = 0; c < Cumes.length; c++) {
        oCumeCounts.push(Cumes[c].length)
    }

    if (nCumeCounts.length != 0)
        if (isSame(nCumeCounts[nCumeCounts.length - 1], oCumeCounts)) {
            wait++
            if (wait > waitStop) {
                itr = false
            }
        } else {
            wait = 0
            waitStop = 10
        }
    nCumeCounts.push(oCumeCounts)

    console.log("Küme ->>> 1")
    console.table(Cumes[0])
    console.log("Küme ->>> 2")
    console.table(Cumes[1])
    iterasyon++
    if (iterasyon > 500) {
        console.log("Zorunlu Kapatma")
        itr = false
    }
}
console.timeEnd("KMeans")

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

