"use strict"
//Selamlar Aşapıdaki örnek ile sağlamasını yapabilirsin.
//Engin EROL
//https://erdincuzun.com/makine_ogrenmesi/decision-tree-karar-agaci-id3-algoritmasi-classification-siniflama/
const veri = {
    ozellik: {
        hava: ["yagmurlu", "yagmurlu", "bulutlu", "gunesli", "gunesli", "gunesli", "bulutlu", "yagmurlu", "yagmurlu", "gunesli", "yagmurlu", "bulutlu", "bulutlu", "gunesli"],
        sicaklik: ["sicak", "sicak", "sicak", "ilik", "soguk", "soguk", "soguk", "ilik", "soguk", "ilik", "ilik", "ilik", "sicak", "ilik"],
        nem: ["yuksek", "yuksek", "yuksek", "yuksek", "normal", "normal", "normal", "yuksek", "normal", "normal", "normal", "yuksek", "normal", "yuksek"],
        ruzgar: ["yok", "var", "yok", "yok", "yok", "var", "var", "yok", "yok", "yok", "yok", "var", "yok", "var"],
    },
    hedef: ["hayir", "hayir", "evet", "evet", "evet", "hayir", "evet", "hayir", "evet", "evet", "evet", "evet", "evet", "hayir"]
}
let itr = true
let iteration = 0
let data = veri; // veri için bir instans oluşturuyoruz
let objP = {}
let maxGainKey = ""
let stop = 1;//En az bir kere dönmesi için 1 olarak ilk değeri alıyorum
let index = 0;
let filterData;
let ft;
while (itr) {
    console.log("Iterasyon : ", iteration)
    let __objP = {}

    /* filterData = datafilter(data, "hava")//
      console.log("filterData yagmurlu",filterData["yagmurlu"])
      console.log("filterData bulutlu",filterData["bulutlu"])
      console.log("filterData gunesli",filterData["gunesli"])
      return; */
    if (maxGainKey != "") {
        if (index == 0)
            filterData = datafilter(data, maxGainKey)

        stop = Object.keys(filterData).length
        data = Object.values(filterData)[index];
        ft = Object.keys(filterData)[index];
        index++
        if (index == Object.keys(filterData).length) {
            stop == iteration
        }
        console.log("stop", stop, "index", "ft", ft, index, "length", Object.keys(filterData).length)
    }

    console.time("desicion calculation time")
    //Hedef değerlerini kendi içinde gruplanması
    const hedefGroup = groupBy(data.hedef)
    //Toplam Hedef sayısı
    let toplamHedef = 0
    for (let i = 0; i < hedefGroup.length; i++) {
        Object.values(hedefGroup[i]).map(item => {
            toplamHedef += item
        }, 0)
    }

    console.table(data.ozellik)
    console.table(data.hedef)
    console.log(`Toplam Değer Sayısı : `, toplamHedef)
    console.log(`------------------------------------------------------------------------------------------------------------`)
    console.log(`                           `)
    console.log(`                           `)
    console.log(`                           `)
    console.log(`Hedef olasılık Değerleri`)
    console.log(`                           `)
    //Hedef değerlerinin olasılık hesapları
    for (let i = 0; i < hedefGroup.length; i++) {
        console.log(`P(${Object.keys(hedefGroup[i])[0]}) = `, olasilik(Object.values(hedefGroup[i])[0], toplamHedef))
    }
    console.log(`------------------------------------------------------------------------------------------------------------`)

    //Hedef değerleri Entropisi
    let hedefEntropi = entropi(hedefGroup, toplamHedef)
    let hedefEntropitext = entropitext(hedefGroup, toplamHedef)
    console.log(`------------------------------------------------------------------------------------------------------------`)
    console.log(`                           `)
    console.log(`                           `)
    console.log(`Hedef Entropisi :`)
    console.log(`                           `)
    console.log(`E(hedef) = `, hedefEntropitext, " = ", hedefEntropi)
    console.log(`                           `)
    console.log(`                           `)
    console.log(`------------------------------------------------------------------------------------------------------------`)

    //Olasılık hesapları
    let P = []
    console.log(`                           `)
    console.log(`                           `)
    console.log(`                           `)
    console.log(`Olasılık Hesapları`)
    console.log(`------------------------------------------------------------------------------------------------------------`)
    for (let i = 0; i < Object.keys(data.ozellik).length; i++) {
        //Özellik Anahtar değerlerine ulaş
        let ozellik_name = Object.keys(data.ozellik)[i]
        //Özellik Değerlerine Ulaş
        let ozellik_value = Object.values(data.ozellik)[i]
        //Özellik değerlerini kendi içinde grupla
        const ozellik_group = groupBy(ozellik_value)

        let pObj = {}
        let _pObj = {}

        for (let j = 0; j < ozellik_group.length; j++) {
            let _p = ozellik_group[j]
            let pName = Object.keys(_p)[0]
            let pValue = Object.values(_p)[0]

            _pObj[pName] = olasilik(pValue, toplamHedef)
            pObj[ozellik_name] = _pObj
            //Özellik değerlerini Olasılıklarını Hesapla
            console.log(`P(${pName}) = `, olasiliktext(pValue, toplamHedef), " = ", olasilik(pValue, toplamHedef))
        }
        P.push(pObj)

        if (i == 3) break;
        else null
    }
    console.log(`------------------------------------------------------------------------------------------------------------`)



    console.log(`------------------------------------------------------------------------------------------------------------`)
    console.log(`                           `)
    console.log(`                           `)
    console.log(`Özellikler Entropisi ve Kazançlar`)
    //Özellik değerlerini hedef değerlerine göre grupla
    for (let i = 0; i < Object.keys(data.ozellik).length; i++) {
        let _sbFt = Object.keys(data.ozellik)[i] //Örnek gelebilecek değer : # hava
        let _sbVl = data.ozellik[_sbFt]  //Örnek gelebilecek değer :  #[ 'yagmurlu', 'yagmurlu', 'bulutlu' ]
        objP[_sbFt] = []
        let _sObj = {}

        for (let j = 0; j < _sbVl.length; j++) {
            let __sObj = {}
            let vl = _sbVl[j]
            let text = data.hedef[j]
            //Eğer dizide alt değer yok ise değeri ekle
            if (typeof _sObj[vl] != "undefined") {
                if (typeof _sObj[vl][text] == "undefined") {
                    _sObj[vl][text] = 1
                } else {
                    //Eğer değer ve alt değer ver ise değere +1 ekle Bu şekilde saymaya devam etsin
                    _sObj[vl][text] = _sObj[vl][text] + 1
                }
            } else {
                //Eğer dizide değer yok ise ilk değeri manuel oluştur
                __sObj[text] = 1
                _sObj[vl] = __sObj
            }
        }
        objP[_sbFt].push(_sObj)

    }

    let gains = []
    console.log(`------------------------------------------------------------------------------------------------------------`)
    console.log(`                           `)
    //Eğer değer ve alt değer ver ise değere +1 ekle Bu şekilde saymaya devam etsin
    for (let i = 0; i < Object.keys(data.ozellik).length; i++) {
        let _sbFt = Object.keys(data.ozellik)[i] ////Örnek gelebilecek değer : #hava
        let __sbft = objP[_sbFt][0]
        let _ent = 0
        console.log(`------------------------------------------------------------------------------------------------------------`)
        console.log(`                           `)
        console.log(`                           `)
        //İşlenen Özellik
        console.log(`Özellik : `, _sbFt.toLocaleUpperCase())
        console.table(__sbft) //Hedef değerler göre karşılaştırmaları
        for (let d = 0; d < Object.keys(__sbft).length; d++) {
            let _vlskey = Object.keys(__sbft)[d]
            let _vls = Object.values(__sbft)[d]
            let _vlstotal = Object.values(_vls).reduce((arr, item) => {
                return arr += item
            }, 0)
            let entropi = _entropi(Object.values(__sbft)[d], _vlstotal)
            let entropitext = _entropitext(Object.values(__sbft)[d], _vlstotal)
            let __p;
            for (let l = 0; l < Object.values(P).length; l++) {
                if (typeof Object.values(P)[l][_sbFt] != "undefined") {
                    __p = Object.values(P)[l][_sbFt][_vlskey]
                    break;
                }
            }
            //İşlenen değerin entropi değeri
            console.log(`E(${_vlskey}) = `, entropitext, " = ", entropi)
            _ent += _grentropi(__p, entropi)
        }
        //Hedef değerlere göre olan entropi ve Kazanç değerleri
        let gain = gainCalc(hedefEntropi, _ent)
        let gainObj = { name: _sbFt, gain: gain }
        gains.push(gainObj)
        console.log(`E(${"hedef"}, ${_sbFt}) = `, ``, _ent, "->", `K(${"hedef"}, ${_sbFt}) = `, ``, gain)
        console.log(`------------------------------------------------------------------------------------------------------------`)
    }
    console.log(`                           `)
    console.log(`------------------------------------------------------------------------------------------------------------`)
    console.log(`------------------------------------------------------------------------------------------------------------`)
    console.log(`                           `)
    let maxGain = 0;

    for (let i = 0; i < gains.length; i++) {

        if (maxGain < gains[i].gain) {
            maxGain = gains[i].gain;
            maxGainKey = gains[i].name
        }
        console.log("Kazanç", gains[i])

    }

    console.log("Max Kazanç : ", maxGain, "Max Feature : ", maxGainKey)

    console.log(`                           `)
    console.log(`------------------------------------------------------------------------------------------------------------`)
    console.timeEnd("desicion calculation time")

    if (iteration == stop) itr = false
    iteration++
}

/**
 * Kazanç Hesabı
 * @param {*} hedefEntropi 
 * @param {*} entropi 
 */
function gainCalc(hedefEntropi, entropi) {
    return hedefEntropi - entropi
}
/**
 * //Özelliklerin entropisini hesaplayan
 * @param {*} p 
 * @param {*} e 
 */
function _grentropi(p, e) {
    return p * e
}
/**
 * Genel Entropi değeri hesaplayan fonksiyon
 * @param {*} group 
 * @param {*} total 
 */
function _entropi(group, total) {
    let _entropi = 0
    for (let i = 0; i < Object.keys(group).length; i++) {
        let vls = Object.values(group)[i]
        _entropi += vls / total * (Math.log2(vls / total))
    }
    return -1 * _entropi
}
/**
 * entropi formülüsü sayısal değerleri ile birlikte yazar
 * @param {*} group 
 * @param {*} total 
 */
function _entropitext(group, total) {
    let _entropi = 0
    for (let i = 0; i < Object.keys(group).length; i++) {
        let vls = Object.values(group)[i]

        _entropi += `${fixZero(vls.toString())}/${fixZero(total.toString())}(Log(${fixZero(vls.toString())}/${fixZero(total.toString())}))`

        if (i != Object.keys(group).length - 1) {
            _entropi += " + "
        }
    }
    return `-1*(${_entropi})`
}
/**
 * Hedef değerinin Entropisini hesaplayan fonksiyon
 * @param {*} group 
 * @param {*} total 
 */
function entropi(group, total) {
    let _entropi = 0
    for (let i = 0; i < group.length; i++) {
        let vls = Object.values(group[i])[0]
        _entropi += vls / total * (Math.log2(vls / total))
    }
    return -1 * _entropi
}
/**
 * Hedef değerinin Entropisini hesaplayan fonksiyon
 * @param {*} group 
 * @param {*} total 
 */
function entropitext(group, total) {
    let _entropi = 0
    for (let i = 0; i < group.length; i++) {
        let vls = Object.values(group[i])[0]
        _entropi += `${fixZero(vls.toString())}/${total.toString()}(Log(${fixZero(vls.toString())}/${total.toString()}))`
        if (i != group.length - 1) {
            _entropi += " + "
        }
    }
    return `-1 * (${_entropi})`
}
/**
 * Olasılık fonksiyonu
 * @param {*} deger 
 * @param {*} toplam 
 */
function olasilik(deger, toplam) {
    return deger / toplam
}
/**
 * Olasılık fonksiyonu
 * @param {*} deger 
 * @param {*} toplam 
 */
function olasiliktext(deger, toplam) {
    return `(${deger}/${toplam})`
}
/**
 * sayıların başındaki 0Ları silemye yarar
 * @param {*} value 
 */
function fixZero(value) {
    if (value.length > 1) {
        if (value.charAt(0) == "0") {
            value.substr(1)
        }
    }
    return value
}
/**
 * Gruplama fonksiyonu
 * @param {*} array 
 */
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
/**
 * Genel veriyi belirli bir anahtar ile filtrelemek için
 * @param {} data 
 * @param {*} feature 
 */
function datafilter(data, feature) {
    let nData = []
   
    let nObj = {}
    let nnObj = []
    let ntObj = []
    let _fdata = data.ozellik
    let _tdata = data.hedef
    let ftData = data.ozellik[feature]


    let groupData = groupBy(ftData).map(item => Object.keys(item)[0])
    for (let i = 0; i < groupData.length; i++) {
        let _arr = {}
        nObj = {}
        let searchkey = groupData[i]

        let idxlist = ftData.map((item, index) => {
            if (item == searchkey) return index
        }).filter(item => typeof item !== "undefined")

        //console.log("idxlist", idxlist, searchkey)
        for (let ft = 0; ft < Object.keys(data.ozellik).length; ft++) {
            let sbKey = Object.keys(_fdata)[ft] //hava
            let sbValues = Object.values(_fdata)[ft] //hava değerler[]
            if (sbKey != feature) {
                /*  console.log("sbValues", sbValues)
                 console.log("idxlist", idxlist)
                 console.log("sbKey", sbKey) */
                //console.log("---------------")

                for (let idx = 0; idx < idxlist.length; idx++) {
                    if (typeof nObj[sbKey] === "undefined") {
                        nObj[sbKey] = [sbValues[idxlist[idx]]]
                    } else {
                        nObj[sbKey] = [...nObj[sbKey], sbValues[idxlist[idx]]]
                    }
                }

                //console.log("nObj[sbKey]", searchkey, nObj[sbKey], sbKey)
                //console.log("---------------")
            }
            nnObj[searchkey] = nObj
        }

        //console.log("searchkey", searchkey)
        //console.log("nnObj", nnObj)
        //console.log("nnObj[searchkey]", nnObj[searchkey])
        _arr["ozellik"] = nnObj[searchkey]
        //console.log("_arr", _arr)
        _arr["hedef"] = idxlist.map((item) => _tdata[item]) //hedefi
        nData[searchkey] = _arr
        //console.log("---------------")
        //console.log("nData yagmurlu", nData["yagmurlu"])
        //console.log("---------------")
        //console.log("nData bulutlu", nData["bulutlu"])
        //console.log("---------------")
        //console.log("nData gunesli", nData["gunesli"])
        //console.log("---------------")
    }

    return nData
};
function dataremove(data, feature) {
    let _arr = {}

    return _arr
};