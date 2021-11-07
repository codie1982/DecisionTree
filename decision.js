const { json } = require('body-parser');
const reader = require("readline-sync");
(async () => {
    const fs = require('fs')
    const path = require("path")
    const readline = require('readline');
    const express = require("express")
    const Router = express.Router();
    const MongoClient = require("mongodb").MongoClient;
    const URI = `mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`
    const DELEMITER = ";"
    const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });

    const run = async () => {
        const path = __dirname + "/data"
        const files = fs.readdirSync(path)
        let fFiles = files.filter(item => {
            let _item = item.split(".")
            if (_item[_item.length - 1] == "csv") return true
        })

        for (let i = 0; i < fFiles.length; i++) {
            let now = Date.now()
            let filename = fFiles[i]
            let _filename = filename.split(".").splice(0, 1).join(".")
            let treename = _filename + "_tree" + "." + "tree"
            let file = path + "/" + filename
            const nData = await setDecisiondata(file)
            const fData = await formatDecisionTree(nData)
            await calculateDecisionTree(fData).then(tree => {
                fs.writeFile(__dirname + "/tree/" + treename, JSON.stringify(tree), function (err) {
                    if (err) return console.log(err);
                    let diff = Date.now() - now
                    console.log(`${"/data"} Klasörünün aldına ${filename} dosyası için ${treename} isimli Karar ağacı ${diff} ms sürede  oluşturuludu`);
                });
            }).catch(err => {
                fs.writeFile(__dirname + "/tree/" + treename, err.message, function (err) {
                    if (err) return console.log(err);
                    console.log(` ${filename} dosyası için veriler hatalı olarak hesaplanmıştır.`);
                });
            })

        }
    };

    const connectDB = async () => {
        await client.connect(async (err, client) => {
            if (err) console.log('failed to connect', err)
            else {
                const collection = await client.db("AVAKADO").collection("job")
                const questionList = await collection.find({ state: true }).toArray()
                console.log("questionList", questionList)

                if (questionList != null) {
                    let userid = questionList.userid
                    let jobid = questionList.id
                    let form = questionList.form
                    console.log(`${userid} Kullanıcısının oluşturduğu ${jobid} id numaralı iş için firmaların olası teklif verme durumu.\n`)

                    const treeList = await loadTree()
                    for (let i = 0; i < treeList.length; i++) {
                        let corp_name = Object.keys(treeList[i])[0]
                        console.log("Firma İsmi : ", corp_name)
                        let corp_guess = await guess(Object.values(treeList[i])[0], form)
                        console.log("firma bu istek için tahmini olarak : ", corp_guess == "evet" ? " Teklif verir " : "Teklif Vermez")
                    }
                } else {
                    console.log("Hazırda bekleyen herhangi bir talep bulunmamaktadır.")
                }

            }
            client.close()
        });
    };
    async function setDecisiondata(file) {
        return new Promise((resolve, reject) => {
            (async () => {
                let _dt = []
                const fileStream = fs.createReadStream(file);
                const rl = readline.createInterface({
                    input: fs.createReadStream(file),
                });
                for await (const line of rl) {
                    // Each line in input.txt will be successively available here as `line`.
                    _dt.push(line)
                }
                resolve(_dt)
            })()
        })
    }
    async function formatDecisionTree(file) {
        return new Promise((resolve, reject) => {
            let _dt = {}
            let feature = {}
            const title = file[0].split(DELEMITER)
            const target = []
            for (let i = 0; i < title.length - 1; i++) {
                for (j = 1; j < file.length; j++) {
                    let _parse = file[j].split(DELEMITER)
                    let __parse = _parse.map(item => title[i] + "&" + item)
                    if (typeof feature[title[i]] == "undefined") {
                        feature[title[i]] = [__parse[i]]
                    } else {
                        feature[title[i]] = [...feature[title[i]], __parse[i]]
                    }
                }
            }

            for (j = 1; j < file.length; j++) {
                let _parse = file[j].split(DELEMITER)
                target.push(_parse[_parse.length - 1])
            }
            _dt["ozellik"] = feature
            _dt["hedef"] = target
            resolve(_dt)
        })


    }
    function calculateDecisionTree(veri) {
        return new Promise((resolve, reject) => {
            let itr = true
            let data = veri
            let iteration = 0
            let objP = {}
            let maxGainKey = ""
            let index = 0;
            let branches = [];
            let nodes = [];
            let reCalcBranches = true
            let tree = []
            let lastNode = ""
            let calcNode = ""
            let calcBranch = ""
            let parentBranches = []
            let result = ""
            let _branches = []
            while (itr) {
                //İlk Düğüm noktası belirlendikten sonra
                if (iteration > 0) {
                    firstNode = nodes[0]
                    lastNode = nodes[nodes.length - 1]
                    if (iteration == 17) {
                        console.log("itr", iteration)

                    }
                    //düğüm noktası oluşturulduktan sonra dallanmalar belirlenir
                    if (reCalcBranches) {
                        calcNode = lastNode //node listesinden son düğüm noktasını hesapla
                        parentBranches = getParentBranchList(tree, calcNode)
                        nodes.splice(nodes.length - 1, 1) //hesaplanan düğüm noktasını düğüm listesinden kaldıralım
                        index = 0 //index'i sıfırla
                        if (nodes.length == 0) {
                            console.log("DUR")
                        }

                        if (typeof calcNode != "undefined") {
                            console.log("itr", iteration)
                        }
                        branches = groupBy(veri.ozellik[calcNode.split(":")[1]]).map(item => Object.keys(item)[0])
                        reCalcBranches = false
                        //last = iteration + branches.length //iterasyonun tamamlanmam sayısı
                    }
                    calcBranch = `${iteration}:${branches[index]}`
                    searchAndReplace(maxGainKey, tree, calcNode, setBranch(calcBranch))
                    _branches = parentBranches.concat(calcBranch)
                    //let olddata = datafilter3(veri, _branches.map(item => item.split(":")[1]))
                    data = datafilter4(veri, _branches.map(item => item.split(":")[1]))

                    index++
                    if (index == branches.length) {
                        reCalcBranches = true
                    }
                    //filter ederken düğüm noktasının parent branchı varmı diye kontrol ermek gerekiyor.
                }

                if (data.hedef.length != 0) {

                    //Hedef değerlerini kendi içinde gruplanması
                    const hedefGroup = groupBy(data.hedef)
                    //Toplam Hedef sayısı
                    let toplamHedef = 0
                    for (let i = 0; i < hedefGroup.length; i++) {
                        Object.values(hedefGroup[i]).map(item => {
                            toplamHedef += item
                        }, 0)
                    }
                    //Hedef değerlerinin olasılık hesapları

                    result = isResult(data.hedef)
                    if (result) {
                        if (maxGainKey != "") {
                            searchAndReplace(maxGainKey, tree, calcBranch, result, true)
                        }
                    } else {
                        /*for (let i = 0; i < hedefGroup.length; i++) {
                              console.log(`P(${Object.keys(hedefGroup[i])[0]}) = `, olasilik(Object.values(hedefGroup[i])[0], toplamHedef))
                          } */


                        //Hedef değerleri Entropisi
                        let hedefEntropi = entropi(hedefGroup, toplamHedef)
                        //Olasılık hesapları
                        let P = []
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
                                //console.log(`P(${pName}) = `, olasiliktext(pValue, toplamHedef), " = ", olasilik(pValue, toplamHedef))
                            }
                            P.push(pObj)

                            if (i == 3) break;
                            else null
                        }
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
                        //Eğer değer ve alt değer ver ise değere +1 ekle Bu şekilde saymaya devam etsin
                        for (let i = 0; i < Object.keys(data.ozellik).length; i++) {
                            let _sbFt = Object.keys(data.ozellik)[i] ////Örnek gelebilecek değer : #hava
                            let __sbft = objP[_sbFt][0]
                            let _ent = 0
                            //İşlenen Özellik
                            for (let d = 0; d < Object.keys(__sbft).length; d++) {
                                let _vlskey = Object.keys(__sbft)[d]
                                let _vls = Object.values(__sbft)[d]
                                let _vlstotal = Object.values(_vls).reduce((arr, item) => {
                                    return arr += item
                                }, 0)
                                let entropi = _entropi(Object.values(__sbft)[d], _vlstotal)
                                let __p = 0;
                                for (let l = 0; l < Object.values(P).length; l++) {
                                    if (typeof Object.values(P)[l][_sbFt] != "undefined") {
                                        __p = Object.values(P)[l][_sbFt][_vlskey]
                                        break;
                                    }
                                }
                                _ent += _grentropi(__p, entropi) //+ Math.random()
                            }
                            //Hedef değerlere göre olan entropi ve Kazanç değerleri
                            let gain = gainCalc(hedefEntropi, _ent)
                            if (iteration >= 100) {
                                gain = gain + Math.random()
                            }
                            let gainObj = { name: _sbFt, gain: gain }
                            gains.push(gainObj)
                        }
                        let maxGain = 0;
                        console.log("iteration", iteration, data)
                        let sortGains = gains.sort((a, b) => (a.gain > b.gain) ? -1 : 1)
                        let duplicate = isDuplicate(sortGains)
                        if (duplicate) {
                            sortGains.splice(0, 1)
                        }

                        maxGain = sortGains[0].gain
                        maxGainKey = `${fixZero(iteration)}:${sortGains[0].name}`
                        if (maxGain != 0) nodes.push(maxGainKey)//düğüm noktası

                        //ilk Kökün eklenmesi
                        if (iteration == 0)
                            searchAndReplace(maxGainKey, tree, "", setNode(maxGainKey))
                        else
                            if (maxGain != 0) searchAndReplace(maxGainKey, tree, calcBranch, setNode(maxGainKey))

                    }


                } else {
                    //reCalcBranches = true
                }
                console.log("nodes", nodes)
                console.log("branches", branches)
                if (nodes.length == 0 && index == branches.length) itr = false

                iteration++
            }

            if (tree.length != 0) {
                searchAndFixed(tree)
                searchAndFixed2(tree)
                resolve(tree)
            } else {
                reject({ error: true, message: "Datasetini kontrol edin" })
            }
        })

    }
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
    function isDuplicate(arr) {
        let max = arr[0]
        let result = false
        for (let i = 0; i < arr.length; i++) {
            if (max.name != arr[i].name && max.gain == arr[i].gain) {
                return true;
            }
        }
        return result
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
    function searchAndReplace(maxGainKey, data, branch, node, string = false) {
        if (branch == "") {
            let _tree = {}
            _tree[maxGainKey] = []
            data.push(_tree)
        } else {
            for (let i = 0; i < data.length; i++) {
                if (typeof data[i] == "object") {
                    let _root = Object.keys(data[i])
                    let _data = Object.values(data[i])
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
                            searchAndReplace(maxGainKey, _data[j], branch, node, string)
                        }
                    }
                }
            }
        }
    }
    function searchAndFixed(_tree) {
        for (let i = 0; i < _tree.length; i++) {
            if (typeof _tree[i] == "object") {
                for (let r = 0; r < Object.keys(_tree[i]).length; r++) {
                    let _key = Object.keys(_tree[i])[r]
                    let _value = Object.values(_tree[i])[r]
                    delete _tree[i][_key]
                    let _nKey = _key.split(":").splice(1, 1)[0]
                    if (typeof _nKey != "undefined")
                        _tree[i][_nKey] = _value
                }
                for (let j = 0; j < Object.values(_tree[i]).length; j++) {
                    searchAndFixed(Object.values(_tree[i])[j])
                }
            }
        }
    }
    function searchAndFixed2(_tree) {
        for (let i = 0; i < _tree.length; i++) {
            if (typeof _tree[i] == "object") {
                for (let r = 0; r < Object.keys(_tree[i]).length; r++) {
                    let _key = Object.keys(_tree[i])[r]
                    let _value = Object.values(_tree[i])[r]
                    let _nKey = _key.split("&")
                    if (_nKey.length > 1) {
                        let __nkey = _nKey[1]
                        delete _tree[i][_key]
                        _tree[i][__nkey] = _value
                    }
                }
                for (let j = 0; j < Object.values(_tree[i]).length; j++) {
                    searchAndFixed2(Object.values(_tree[i])[j])
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
    function getRoot(tree) {
        for (let i = 0; i < tree.length; i++) {
            if (typeof tree[i] == "object") {
                let _root = Object.keys(tree[i])
                return _root[0];
            }
        }
    }
    function getNode(tree, branch) {
        for (let i = 0; i < tree.length; i++) {
            if (typeof tree[i] == "object") {
                let _root = Object.keys(tree[i])
                let _data = Object.values(tree[i])
                if (_root == branch) {
                    if (typeof _data[0][0] == "object") {
                        return _data[0][0];
                    } else {
                        return _data[0];
                    }
                    //break;
                } else {
                    for (let j = 0; j < _data.length; j++) {
                        let rs = getNode(_data[j], branch)
                        if (typeof rs != "undefined") return rs
                    }
                }
            }
        }
    }
    /**
     * 
     * @param {*} tree 
     * @param {*} node 
     */
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
                        if (add == branches.length - 1) {
                            selectedIndex.push(t)
                            search = false
                        }
                        jj++
                        if (jj == Object.values(_feature).length) search = false
                    }
                }
            }
        }

        let nObj = {}
        for (let f = 0; f < Object.keys(_feature).length; f++) {
            let key = Object.keys(_feature)[f]
            let values = Object.values(_feature)[f]
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
    function datafilter4(data, branches) {
        if (branches.length == 0) return null

        let nData = []
        let _arr = {}
        let feature = data.ozellik//ozellik listesi
        let nFeature = {}
        let target = data.hedef//Hedef listesi
        let nTarget = []

        //let ky = Object.keys(feature)
        //let arr = Object.values(feature)

        //ilgili branca ait index listesi
        let selectedIndex = []

        for (let i = 0; i < branches.length; i++) {
            let _selectedIndex = []
            //dallanma değeri
            let colonname = branches[i].split("&")[0]//hava
            //Dallanmanın tabloda hangi kolonda olduğu
            //Dalın Data tablosunda bulunduğu kolonun index değeri
            let ky = Object.keys(feature).findIndex(item => item == colonname)
            //seçili index değerine ait filitrelenmiş veriler
            _selectedIndex = Object.values(feature)[ky].map((item, idx) => {
                if (item == branches[i])
                    return idx
            }).filter(item => typeof item != "undefined")

            if (selectedIndex.length == 0) {
                selectedIndex = _selectedIndex
            } else {
                selectedIndex = selectedIndex.filter((x) => _selectedIndex.includes(x))
            }
        }

        //Özellikleri filtreliyor
        for (let f = 0; f < Object.keys(feature).length; f++) {
            let key = Object.keys(feature)[f]
            let values = Object.values(feature)[f]
            for (let idx = 0; idx < selectedIndex.length; idx++) {
                if (typeof nFeature[key] === "undefined") {
                    nFeature[key] = [values[selectedIndex[idx]]]
                } else {
                    nFeature[key] = [...nFeature[key], values[selectedIndex[idx]]]
                }
            }
        }
        /*  for (let j = 0; j < Object.keys(feature).length; j++) {
             let nf = Object.values(feature)[j]
             for (let t = 0; t < selectedIndex.length; t++) {
                 let vl = nf[selectedIndex[t]]
                 if (typeof nFeature[Object.keys(nFeature)[j]] == "undefined") {
                     nFeature[Object.keys(feature)[j]] = [vl]
                 } else {
                     nFeature[Object.keys(feature)[j]] = [vl, ...nFeature[Object.keys(feature)[j]]]
                 }
             }
         } */
        //hedeflemeyi filtreliyor
        for (let ii = 0; ii < selectedIndex.length; ii++) {
            if (typeof nTarget == "undefined") {
                nTarget = [target[selectedIndex[ii]]]
            } else {
                nTarget = [...nTarget, target[selectedIndex[ii]]]
            }

        }
        _arr["ozellik"] = nFeature
        _arr["hedef"] = nTarget

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
    let questionList = {
        id: "202ad66-fd1-8b4-670-1a605fca4f30",
        userid: "111",
        form: [
            { node: "sicaklik", branch: "ilik" },
            { node: "nem", branch: "normal" },
            { node: "hava", branch: "bulutlu" },
            { node: "ruzgar", branch: "yok" },
        ]
    }
    async function loadTree() {
        return new Promise((resolve, reject) => {
            (async () => {
                const path = __dirname + "/tree"
                const files = fs.readdirSync(path)
                let list = []
                let _tr = {}
                for (let i = 0; i < files.length; i++) {
                    let filename = files[i]
                    let corpname = filename.split("_")[0]
                    let file = path + "/" + filename
                    const fileStream = fs.createReadStream(file);
                    const rl = readline.createInterface({
                        input: fileStream,
                    });
                    for await (const line of rl) {
                        // Each line in input.txt will be successively available here as `line`.
                        _tr[corpname] = JSON.parse(line)
                        list.push(_tr)
                    }
                }
                resolve(list)
            })()
        })
    }
    async function guess(cropTree, form) {
        let guess = "";
        let turn = true
        let root = getRoot(cropTree)
        let selectedRootBranch = form.find(item => item.node == root)
        let selectedNode = getNode(cropTree, selectedRootBranch.branch)
        if (typeof selectedNode != "object") {
            turn = false
            guess = selectedNode;
        } else {
            while (turn) {
                let selectSubNode = form.find(item => item.node == Object.keys(selectedNode)[0])
                selectedNode = getNode(cropTree, selectSubNode.branch)
                if (typeof selectedNode != "object") {
                    turn = false
                    guess = selectedNode;
                }
            }
        }
        return guess
    }
    async function main() {
        await run();
        let turn = true
        console.clear()
        console.log("********************************************************************\n")
        console.log("* Merhaba Kullanıcı;                                               *\n")
        console.log("* ID3 ile karar ağacı oluşturma ve firma tahmin programı;          *\n")
        console.log("* Aşağıdaki menuden ne yapmak istediğini seçebilirsin.             *\n")
        menu(false)
        console.log("********************************************************************\n")


        while (turn) {
            let action = reader.question("Eylem: ");
            switch (parseInt(action)) {
                case 1:
                    let sure = reader.question("Data klasörünün içinde ki dosyalar için karar ağaçları oluşturulacaktır. Eminmisin: Evet - (E) - Hayır (H)");
                    if (sure == "E" || sure == "e") {
                        console.log("Karar ağacı oluşturuldu.\n")
                        await run()
                    } else {
                        console.log("Karar ağacı oluşturulmadı.\n")
                        menu()
                    }
                    break;
                case 2:
                    await connectDB()
                    break;
                case 9:
                    turn = false
                    console.log("Belirttiğiniz alanda bir eylem bulunmamaktadır. Lütfen menuden bir seçim Programdan çıkış yapılıyor\n");
                default:
                    console.log("Belirttiğiniz alanda bir eylem bulunmamaktadır. Lütfen menuden bir seçim yapınız.\n")
                    menu()
                    break;
            }

        }

    }
    function menu(clearScreen = true) {
        if (clearScreen) console.clear()
        console.log("Karar Ağacı Oluştur ------------- 1\n")
        console.log("Karar Ağacı tahmininde bulun ---- 2\n")
        console.log("Çıkış --------------------------- 9\n")
    }
    await main()
})()

