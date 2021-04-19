"use strict"

const { prototype } = require("inquirer/lib/objects/choice");

//Selamlar Aşapıdaki örnek ile sağlamasını yapabilirsin.
//Engin EROL
//https://erdincuzun.com/makine_ogrenmesi/decision-tree-karar-agaci-id3-algoritmasi-classification-siniflama/
let _veri = {
    ozellik: {
        hava: ["yagmurlu", "yagmurlu", "bulutlu", "gunesli", "gunesli", "gunesli", "bulutlu", "yagmurlu", "yagmurlu", "gunesli", "yagmurlu", "bulutlu", "bulutlu", "gunesli"],
        sicaklik: ["sicak", "sicak", "sicak", "ilik", "soguk", "soguk", "soguk", "ilik", "soguk", "ilik", "ilik", "ilik", "sicak", "ilik"],
        nem: ["yuksek", "yuksek", "yuksek", "normal", "normal", "normal", "normal", "yuksek", "normal", "normal", "normal", "yuksek", "normal", "yuksek"],
        ruzgar: ["yok", "var", "yok", "yok", "yok", "var", "var", "yok", "yok", "yok", "yok", "var", "yok", "var"],
    },
    hedef: ["hayir", "hayir", "evet", "evet", "evet", "hayir", "evet", "hayir", "evet", "evet", "evet", "evet", "evet", "hayir"]
}
var decisionTree2 =
    [
        {
            hava: [
                {
                    yagmurlu: [
                        {
                            nem:
                                [
                                    { yuksek: "hayir" },
                                    { normal: "evet" },

                                ]
                        }
                    ],
                },
                { bulutlu: "evet" },
                {
                    gunesli: [
                        {
                            ruzgar:
                                [
                                    { yok: "evet" },
                                    { var: "hayir" },

                                ]
                        }
                    ]
                },
            ]
        }
    ];
/* 
Kısım   Maaş   Tecrübe MeslekGrubu
Yazılım Yüksek Çok     Yönetici
Donanım Yüksek Az      Memur
Sistem  Normal Çok     Memur
Yazılım Az     Çok     Yönetici
Donanım Normal Çok     Yönetici
Sistem  Yüksek Çok     Yönetici  
Yazılım Az     Orta    Memur
Donanım Az     Az      Memur
Sistem  Az     Çok     Memur
 */
const __veri = {
    ozellik: {
        kisim: ["yazilimkisim", "donanimkisim", "sistemkisim", "yazilimkisim", "donanimkisim", "sistemkisim", "yazilimkisim", "donanimkisim", "sistemkisim"],
        maas: ["yuksekmaas", "yuksekmaas", "normalmaas", "azmaas", "normalmaas", "yuksekmaas", "azmaas", "azmaas", "azmaas"],
        tecrube: ["coktecrube", "aztecrube", "coktecrube", "coktecrube", "coktecrube", "coktecrube", "ortatecrube", "aztecrube", "coktecrube"],
    },
    hedef: ["yonetici", "memur", "memur", "yonetici", "yonetici", "yonetici", "memur", "memur", "memur"]
}

const veri = {
    ozellik: {
        hava: ["guneslihava", "guneslihava", "ruzgarlihava"  , "yagmurluhava"  , "yagmurluhava" , "yagmurluhava" , "ruzgarlihava"  , "ruzgarlihava"  , "ruzgarlihava"  , "guneslihava"],
        aile: ["evetaile"   , "hayiraile"  , "evetaile"      , "evetaile"      , "hayiraile"    , "evetaile"     , "hayiraile"     , "hayiraile"     , "evetaile"      , "hayiraile"],
        para: ["zenginpara" , "zenginpara" , "zenginpara"    , "fakirpara"     , "zenginpara"   , "fakirpara"    , "fakirpara"     , "zenginpara"    , "zenginpara"    , "zenginpara"],
    },
    hedef: ["sinema"        , "tenis"      , "sinema"        , "sinema"         , "ev"          , "sinema"       , "sinema"        , "alisveris"     , "sinema"        , "tenis"]
}

let itr = true
let iteration = 0
let data = veri; // veri için bir instans oluşturuyoruz
let objP = {}
let maxGainKey = ""
let stop = 5;//En az bir kere dönmesi için 1 olarak ilk değeri alıyorum
let index = 0;
let filterData;
let featureName;
let featureList = [];
let decision = []
let _decision = []
let rootlist = []
let mRoot = ""
let root = ""
let branches;
let nodes = [];
//data = datafilter2(data, "hava", "yagmurlu")
let last = 1;
let reCalcBranches = true
let selectedBranch = ""
let rmData = []
let tree = []
let decisionTree = []
let lastBranch = "";
let lastRoot = "";
let firstNode = ""
let lastNode = ""
let calcNode = ""
let calcBranch = ""
let parentBranches = []
let result = ""
let _branches = []

while (itr) {
    //İlk Düğüm noktası belirlendikten sonra
    console.log("Iterasyon Sayısı : ", iteration)
    if (iteration > 0) {
        firstNode = nodes[0]
        lastNode = nodes[nodes.length - 1]
        console.log("Kök Düğüm Lstesi: ", nodes) // diğer düğüm noktalarını veriden kaldırmak gerekli
        console.log("Kök Düğüm : ", nodes[0]) // diğer düğüm noktalarını veriden kaldırmak gerekli
        console.log("Son Düğüm : ", nodes[nodes.length - 1]) // diğer düğüm noktalarını veriden kaldırmak gerekli
        //düğüm noktası oluşturulduktan sonra dallanmalar belirlenir

        if (reCalcBranches) {
            console.log("Dallanma belirleniyor...")
            calcNode = lastNode //node listesinden son düğüm noktasını hesapla
            parentBranches = getParentBranchList(tree, calcNode)
            nodes.splice(nodes.length - 1, 1) //hesaplanan düğüm noktasını düğüm listesinden kaldıralım
            index = 0//index'i sıfırla
            branches = groupBy(data.ozellik[calcNode]).map(item => Object.keys(item)[0])
            reCalcBranches = false
            last = iteration + branches.length //iterasyonun tamamlanmam sayısı
        }
        console.log("Hesaplanan Düğüm : ", calcNode) // diğer düğüm noktalarını veriden kaldırmak gerekli
        calcBranch = branches[index]

        searchAndReplace(tree, calcNode, setBranch(calcBranch))
        _branches = parentBranches.concat(calcBranch)
        data = datafilter3(veri, _branches)
        index++
        if (index == branches.length) {
            reCalcBranches = true
            //nodes.length != 0 ? last++ : data = null
        }
        //console.log("tree :", tree)
        console.log("Alt Dallanmalar :", branches)
        console.log("maxGainKey,", maxGainKey)
        console.log("index", index)
        console.log("Hesaplanan Dal : ", calcBranch)

        //filter ederken düğüm noktasının parent branchı varmı diye kontrol ermek gerekiyor.
    }

    if (data != null) {
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

        result = isResult(data.hedef)

        if (result) {
            console.log(`${calcBranch} dalı için bir sonuç oluştu : `, result)
            searchAndReplace(tree, calcBranch, result, true)
        } else {

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
            console.log(`E(${typeof featureName == "undefined" ? "hedef" : featureName}) = `, hedefEntropitext, " = ", hedefEntropi)
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

                let _enttxt = ""
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
                    console.log(`------------------------------------------------------------------------------------------------------------`)

                    //console.log("_vlskey", _vlskey)
                    //console.log("_vls", _vls)
                    let _vlstotal = Object.values(_vls).reduce((arr, item) => {
                        return arr += item
                    }, 0)
                    //console.log("_vlstotal", _vlstotal)
                    //console.log(`------------------------------------------------------------------------------------------------------------`)

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
                    console.log(`E(${typeof featureName == "undefined" ? "hedef" : featureName},${_vlskey}) = `, entropitext, " = ", entropi)

                    if (d == Object.keys(__sbft).length) {
                        _enttxt += _grentropitxt(__p, entropi, false)
                    } else {
                        _enttxt += _grentropitxt(__p, entropi, true)
                    }

                    _ent += _grentropi(__p, entropi)
                }
                //Hedef değerlere göre olan entropi ve Kazanç değerleri

                let gain = gainCalc(hedefEntropi, _ent)
                let gainObj = { name: _sbFt, gain: gain }
                gains.push(gainObj)
                console.log("Olasılık * Entropi = ", _enttxt)
                console.log(` `)
                console.log(`E(${typeof featureName == "undefined" ? "hedef" : featureName}, ${_sbFt}) = `, ``, _ent, "->", `K(${typeof featureName == "undefined" ? "hedef" : featureName}, ${_sbFt}) = `, ``, gain)
                console.log(`------------------------------------------------------------------------------------------------------------`)
            }
            console.log(`                           `)
            console.log(`------------------------------------------------------------------------------------------------------------`)
            console.log(`------------------------------------------------------------------------------------------------------------`)
            console.log(`                           `)
            let maxGain = 0;
            let sortGains = gains.sort((a, b) => (a.gain > b.gain) ? -1 : 1)
            maxGain = sortGains[0].gain
            maxGainKey = sortGains[0].name
            if (maxGain != 0) nodes.push(maxGainKey)//düğüm noktası

            console.log("maxGainKey", maxGainKey)

            //ilk kökü eklemesi için

            if (iteration == 0)
                searchAndReplace(tree, "", setNode(maxGainKey))
            else
                if (maxGain != 0) searchAndReplace(tree, calcBranch, setNode(maxGainKey))

            console.log(`                           `)
            console.log("Max Kazanç : ", maxGain, "Max Feature : ", maxGainKey)
            console.log(`                           `)
            console.log(`------------------------------------------------------------------------------------------------------------`)
            console.timeEnd("desicion calculation time")
        }


    }
    if (nodes.length == 0 && index == branches.length) itr = false
    iteration++
}

console.log("Toplam Iterasyon Sayısı : ", iteration)
console.log(JSON.stringify(tree, null, 2))

function setBranch(branch) {
    let item = {}
    item[branch] = []
    return item
}
function setNode(node) {
    let item = {}
    item[node] = []
    return item
}
function isResult(hedef) {
    if (typeof hedef != "object") return false;
    let _fHedef = hedef[0]
    for (let i = 0; i < hedef.length; i++) {
        if (hedef[i] != _fHedef) {
            return false
        }
    }
    return _fHedef;

}
function searchAndReplace(data, branch, node, string = false) {
    if (branch == "") {
        let _tree = {}
        _tree[maxGainKey] = []
        data.push(_tree)
    } else {
        for (let i = 0; i < data.length; i++) {
            if (typeof data[i] == "object") {
                let _root = Object.keys(data[i])
                let _data = Object.values(data[i])
                console.log("types", typeof _data)
                console.log("_root", _root)
                console.log("_data", _data)
                if (_root.includes(branch)) {
                    //aranan düğüm noktası bulundu
                    let searchFields = Object.keys(node)[0]
                    let fields = Object.values(data[i][branch]).map((branch, index) => Object.keys(branch)[index])
                    if (!fields.includes(searchFields)) {
                        if (string) {
                            data[i][branch] = node
                        } else {
                            data[i][branch].push(node)
                        }

                    }
                    break;
                } else {
                    for (let j = 0; j < _data.length; j++) {
                        searchAndReplace(_data[j], branch, node, string)
                    }
                }
            }
        }
    }
}

function getParentBranch(tree, node, parentBranch) {
    for (let i = 0; i < tree.length; i++) {
        if (typeof tree[i] == "object") {
            let _root = Object.keys(tree[i])
            let _data = Object.values(tree[i])
            if (_root.includes(node)) {
                return parentBranch
                //break;
            } else {
                for (let j = 0; j < _data.length; j++) {
                    let rs = getParentBranch(_data[j], node, _root[j])
                    if (typeof rs != "undefined") return rs
                }
            }
        }
    }
}
function getParentBranchList(tree, node) {
    let branchList = []
    let itr = true
    let iteration = 0
    let parentBranch = node
    while (itr) {
        parentBranch = getParentBranch(tree, parentBranch)
        if (typeof parentBranch == "undefined" || parentBranch == "") {
            itr = false
        } else {
            if (iteration == 1) {
                iteration = 0
            } else {
                branchList.push(parentBranch)
                iteration++
            }
        }
    }
    return branchList
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
 * //Özelliklerin entropisini hesaplayan
 * @param {*} p 
 * @param {*} e 
 */
function _grentropitxt(p, e, plus) {
    if (plus)
        return `${p} * ${e} + `
    else
        return `${p} * ${e}`
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
    if (_entropi == 0) return 0
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
    if (_entropi == 0) return 0
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

        for (let ft = 0; ft < Object.keys(data.ozellik).length; ft++) {
            let sbKey = Object.keys(_fdata)[ft] //hava
            let sbValues = Object.values(_fdata)[ft] //hava değerler
            if (sbKey != feature) {
                for (let idx = 0; idx < idxlist.length; idx++) {
                    if (typeof nObj[sbKey] === "undefined") {
                        nObj[sbKey] = [sbValues[idxlist[idx]]]
                    } else {
                        nObj[sbKey] = [...nObj[sbKey], sbValues[idxlist[idx]]]
                    }
                }
            }
            nnObj[searchkey] = nObj
        }
        _arr["ozellik"] = nnObj[searchkey]
        _arr["hedef"] = idxlist.map((item) => _tdata[item]) //hedefi
        nData[searchkey] = _arr
    }
    return nData
};
/**
 * Genel veriyi belirli bir anahtar ile filtrelemek için
 * @param {} data 
 * @param {*} feature 
 */
function datafilter2(data, feature, branch) {
    let nData = []
    let _arr = {}
    let _feature = data.ozellik//ozellik listesi
    let _class = []

    if (typeof branch == "undefined") return null
    let feature_data = _feature[feature]////ozellik array
    //ilgili branca ait index listesi
    let listFeaturIndexList = feature_data.map((item, index) => {
        if (item == branch) return index
    }).filter(item => typeof item != "undefined")

    let nObj = {}
    for (let i = 0; i < Object.keys(_feature).length; i++) {
        let key = Object.keys(_feature)[i]
        let values = Object.values(_feature)[i]
        //if (key != feature) {}
        for (let idx = 0; idx < listFeaturIndexList.length; idx++) {
            if (typeof nObj[key] === "undefined") {
                nObj[key] = [values[listFeaturIndexList[idx]]]
            } else {
                nObj[key] = [...nObj[key], values[listFeaturIndexList[idx]]]
            }
        }
    }
    //TODO : Filtre değerlerini hedef içinde uygula
    for (let i = 0; i < listFeaturIndexList.length; i++) {
        _class = [..._class, data.hedef[listFeaturIndexList[i]]]
    }
    _arr["ozellik"] = nObj
    _arr["hedef"] = _class

    return _arr;
};
function datafilter3(data, branches) {
    let nData = []
    let _arr = {}
    let _feature = data.ozellik//ozellik listesi
    let _class = []
    if (branches.length == 0) return null
    //ilgili branca ait index listesi
    let ky = Object.keys(_feature)
    let arr = Object.values(_feature)
    let selectedIndex = []
    for (let j = 0; j < arr.length; j++) {
        let fBranch = branches[0]
        for (let t = 0; t < arr[j].length; t++) {
            let ft = arr[j][t] //değer
            let fKey = ky[j] //değer
            if (fBranch == ft) {
                let search = true
                let add = 0
                let jj = 0
                while (search) {
                    if (jj != j) {
                        let keys = Object.keys(_feature)[jj]
                        let _arr = Object.values(_feature)[jj]
                        if (branches.includes(_arr[t])) {
                            add++
                        }
                    }
                    if (add == branches.length-1) {
                        selectedIndex.push(t)
                        search = false
                    }
                    jj++
                    if (jj == Object.values(_feature).length) search = false
                }
            }
        }
    }
    console.log("selectedIndex", selectedIndex)
    let nObj = {}
    for (let f = 0; f < Object.keys(_feature).length; f++) {
        let key = Object.keys(_feature)[f]
        let values = Object.values(_feature)[f]
        console.log("values", values)
        //let keys = Object.keys(listFeaturIndexItem)
        for (let idx = 0; idx < selectedIndex.length; idx++) {
            if (typeof nObj[key] === "undefined") {
                nObj[key] = [values[selectedIndex[idx]]]
            } else {
                nObj[key] = [...nObj[key], values[selectedIndex[idx]]]
            }
        }
    }
    //TODO : Filtre değerlerini hedef içinde uygula
    for (let i = 0; i < selectedIndex.length; i++) {
        _class = [..._class, data.hedef[selectedIndex[i]]]
    }
    _arr["ozellik"] = nObj
    _arr["hedef"] = _class

    return _arr;
};
function dataremove(data, key) {
    let _data = {};
    let rm = removeKey(key, data.ozellik)
    _data["ozellik"] = rm
    _data["hedef"] = data.hedef
    return _data
};
function removeKey(key, { [key]: _, ...rest }) {
    return rest
}
