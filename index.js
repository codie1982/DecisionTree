"use strict"

const veri = {
    ozellik: {
        hava: ["yagmurlu", "yagmurlu", "bulutlu", "gunesli", "gunesli", "gunesli", "bulutlu", "yagmurlu", "yagmurlu", "gunesli", "yagmurlu", "bulutlu", "bulutlu", "gunesli"],
        sicaklik: ["sicak", "sicak", "sicak", "ilik", "soguk", "soguk", "soguk", "ilik", "soguk", "ilik", "ilik", "ilik", "sicak", "ilik"],
        nem: ["yuksek", "yuksek", "yuksek", "yuksek", "normal", "normal", "normal", "yuksek", "normal", "normal", "normal", "yuksek", "normal", "yuksek"],
        ruzgar: ["yok", "var", "yok", "yok", "yok", "var", "var", "yok", "yok", "yok", "yok", "var", "yok", "var"],
    },
    hedef: ["hayir", "hayir", "evet", "evet", "evet", "hayir", "evet", "hayir", "evet", "evet", "evet", "evet", "evet", "hayir"]
}

const hedefGroup = groupBy(veri.hedef)
let toplamHedef = 0
for (let i = 0; i < hedefGroup.length; i++) {
    Object.values(hedefGroup[i]).map(item => {
        toplamHedef += item
    }, 0)
}
console.table(veri.ozellik)
console.table(veri.hedef)
//console.table(hedefGroup)
console.log(`Toplam Değer Sayısı : `, toplamHedef)
console.log(`---------------------------`)
console.log(`                           `)
console.log(`                           `)
console.log(`                           `)
console.log(`Hedef olasılık Değerleri`)
console.log(`                           `)
for (let i = 0; i < hedefGroup.length; i++) {
    console.log(`P(${Object.keys(hedefGroup[i])[0]}) = `, olasilik(Object.values(hedefGroup[i])[0], toplamHedef))
}
console.log(`---------------------------`)
//Permutasyon hesapları
let P = []
console.log(`                           `)
console.log(`                           `)
console.log(`                           `)
console.log(`Olasılık Hesapları`)
console.log(`---------------------------`)
for (let i = 0; i < Object.keys(veri.ozellik).length; i++) {
    let ozellik_name = Object.keys(veri.ozellik)[i] //hava
    let ozellik_value = Object.values(veri.ozellik)[i] //hava

    const ozellik_group = groupBy(ozellik_value)

    let pObj = {}
    let _pObj = {}

    for (let j = 0; j < ozellik_group.length; j++) {
        let _p = ozellik_group[j]
        let pName = Object.keys(_p)[0]
        let pValue = Object.values(_p)[0]

        _pObj[pName] = olasilik(pValue, toplamHedef)
        pObj[ozellik_name] = _pObj
       
        console.log(`P(${pName}) = `, olasilik(pValue, toplamHedef))
    }
    P.push(pObj)

    if (i == 3) break;
    else null
}
console.log(`---------------------------`)

let hedefEntropi = entropi(hedefGroup, toplamHedef)
console.log(`---------------------------`)
console.log(`                           `)
console.log(`                           `)
console.log(`Hedef Entropisi :`)
console.log(`                           `)
console.log(`E(hedef) = `, hedefEntropi)
console.log(`                           `)
console.log(`                           `)
console.log(`---------------------------`)


let objP = {}
console.log(`---------------------------`)
console.log(`                           `)
console.log(`                           `)
console.log(`Özellikler Entropisi ve Kazançlar`)
for (let i = 0; i < Object.keys(veri.ozellik).length; i++) {
    let _sbFt = Object.keys(veri.ozellik)[i] //hava
    let _sbVl = veri.ozellik[_sbFt]  //[ 'yagmurlu', 'yagmurlu', 'bulutlu' ]
    objP[_sbFt] = []

    let _sObj = {}
    for (let j = 0; j < _sbVl.length; j++) {
        let __sObj = {}
        let vl = _sbVl[j]
        let text = veri.hedef[j]
        if (typeof _sObj[vl] != "undefined") {
            if (typeof _sObj[vl][text] == "undefined") {
                _sObj[vl][text] = 1
            } else {
                _sObj[vl][text] = _sObj[vl][text] + 1
            }
        } else {
            //İlk Değeri yazsın
            __sObj[text] = 1
            _sObj[vl] = __sObj
        }
    }
    objP[_sbFt].push(_sObj)

}
console.log(`---------------------------`)
console.log(`                           `)
for (let i = 0; i < Object.keys(veri.ozellik).length; i++) {
    let _sbFt = Object.keys(veri.ozellik)[i] //hava
    let __sbft = objP[_sbFt][0]
    let _ent = 0
    console.log(`---------------------------`)
    console.log(`                           `)
    console.log(`                           `)
    console.log(`Alan : `,_sbFt.toLocaleUpperCase())
    console.table(__sbft)
    for (let d = 0; d < Object.keys(__sbft).length; d++) {
        let _vlskey = Object.keys(__sbft)[d]
        let _vls = Object.values(__sbft)[d]
        let _vlstotal = Object.values(_vls).reduce((arr, item) => {
            return arr += item
        }, 0)
        let entropi = _entropi(Object.values(__sbft)[d], _vlstotal)
        let __p;
        for (let l = 0; l < Object.values(P).length; l++) {
            if (typeof Object.values(P)[l][_sbFt] != "undefined") {
                __p = Object.values(P)[l][_sbFt][_vlskey]
                break;
            }
        }
        console.log(`E(${_vlskey}) = `,entropi)
        _ent += _grentropi(__p, entropi)
    }
 
    console.log(`E(${"hedef"}, ${_sbFt}) = `, ``, _ent,"->",`K(${"hedef"}, ${_sbFt}) = `, ``, gain(hedefEntropi, _ent))
    console.log(`---------------------------`)
}
console.log(`                           `)
console.log(`---------------------------`)

function gain(hedefEntropi, entropi) {
    return hedefEntropi - entropi
}

function _grentropi(p, e) {
    return p * e
}

function _entropi(group, total) {
    let _entropi = 0
    for (let i = 0; i < Object.keys(group).length; i++) {
        let vls = Object.values(group)[i]
        _entropi += vls / total * (Math.log2(vls / total))
    }
    return -1 * _entropi
}

function entropi(group, total) {
    let _entropi = 0
    for (let i = 0; i < group.length; i++) {
        let vls = Object.values(hedefGroup[i])[0]
        _entropi += vls / total * (Math.log2(vls / total))
    }
    return -1 * _entropi
}
function olasilik(deger, toplam) {
    return deger / toplam
}

function groupBy(array) {
    let _arr = [];
    for (let i = 0; i < array.length; i++) {
        let obj = {}
        const idx = _arr.findIndex(function (item) {
            if (Object.keys(item)[0] == array[i]) {
                return true
            } else {
                return false
            }
        })
        if (idx != -1) {
            //değer varsa
            _arr[idx][array[i]] = _arr[idx][array[i]] + 1
        } else {
            //değer yoksa
            obj[array[i]] = 1
            _arr.push(obj)
        }
    }
    return _arr
};
