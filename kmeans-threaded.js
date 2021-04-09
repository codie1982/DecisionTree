const { Worker, isMainThread,threadId, parentPort, workerData } = require('worker_threads');
const { movePoint, isSame, cumeCenter, searchPoint, distance } = require("./util/util")
"use strict"
//Selamlar Aşapıdaki örnek ile sağlamasını yapabilirsin.
//Engin EROL
//https://erdincuzun.com/makine_ogrenmesi/k-nn-algoritmasi/

let _dt = JSON.parse(workerData)
let data = _dt.data
let Cumes = _dt.cume
let iterasyon = _dt.iterasyon
let itr = _dt.itr
let wait = _dt.wait
let waitStop = _dt.waitStop

let nCumeCounts = _dt.nCumeCounts
console.time("KMeans")
console.log(`${threadId} Starting ...`);
let oCumeCounts = []
//console.log("Iterasyon Sayısı", iterasyon)
for (let i = 0; i < data.length; i++) {
    let D = []
    let _D = []
    for (let k = 0; k < 2; k++) {
        //Kume merkezini hesapla
        let _cumeCenter = cumeCenter(Cumes[k])
        for (let j = 0; j < Cumes[k].length; j++) {
            let diff = distance(_cumeCenter, data[i])
            D.push(diff)
            _D.push({ data: data[i], dataIndex: i, cumes: Cumes[k][j], cumeIndex: j, diff, KIndex: k, K: k + 1, _cumeCenter })
        }
    }
    let minDis = _D.find(item => item.diff == D.sort()[0])
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
        console.log("wait")
        wait++
        if (wait > waitStop) {
            itr = false
        }
    } else {
        wait = 0
        waitStop = 10
    }
nCumeCounts.push(oCumeCounts)

iterasyon++

if (iterasyon > 500) {
    console.log("Zorunlu Kapatma")
    itr = false
}

parentPort.postMessage(JSON.stringify({ itr, iterasyon, Cumes, wait, waitStop,nCumeCounts }));





