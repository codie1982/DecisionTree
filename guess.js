
(async () => {
    const express = require("express")
    const Router = express.Router();
    const MongoClient = require("mongodb").MongoClient;
    const fs = require('fs')
    const path = require("path")
    const readline = require('readline');
    const URI = `mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`
    const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect(async (err, client) => {
        if (err) console.log('failed to connect', err)
        else {
            const collection = await client.db("AVAKADO").collection("job")
            const questionList = await collection.find({ state: true }).toArray()
            if (questionList.length != 0) {
                for (let i = 0; i < questionList.length; i++) {

                    let userid = questionList[i].jobuser
                    let jobid = questionList[i].jobid
                    let jobform = questionList[i].jobform
                    console.log(`\n\n`)
                    console.log(`****************************************************`)
                    console.log("Kullanıcının oluşturduğu iş için olası teklif durumu")
                    console.log(`Kullanıcı Numarası\t: ${userid}`)
                    console.log(`Talep ID'si\t\t: ${jobid}`)
                    console.log(`****************************************************`)
                    console.log(`\n\n`)

                    const treeList = await loadTree()
                    for (let i = 0; i < Object.values(treeList).length; i++) {
                        let tree = Object.values(treeList)[i]
                        let corp_name = Object.keys(treeList)[i]
                        console.log("Firma İsmi : ", corp_name)
                        console.log(" ")
                        let corp_guess = await guess(tree, jobform)
                        console.log(" ")
                        console.log("firma bu istek için tahmini olarak : ", corp_guess == "evet" ? " Teklif verir " : "Teklif Vermez")
                    }
                }
            } else {
                console.log("Hazırda bekleyen herhangi bir talep bulunmamaktadır.")
            }

        }
        client.close()
    });
    async function guess(tree, form) {
        let guess = "";
        //root ile ilk sorunun cevabını almamız gerekli 
        let turn = true
        let subTree = tree;
        let fQuest;
        let fTree;
        let answer;
        let count = 0;
        while (turn) {
            count++
            //console.log(`${count}. Döngü -----`)
            fQuest = getQuest(subTree)
            //console.log("fQuest", fQuest)
            fTree = Object.values(subTree).find(item => Object.keys(item[fQuest]))
            //console.log("fTree", fTree[fQuest])
            answer = form.find(item => item.node == fQuest).branch
            //console.log("fAnswer", answer)
            subTree = getTree(fTree[fQuest], answer)
            //console.log("subTree", subTree)
            if (typeof subTree == "object") {
                if (subTree.length == 0) {
                    turn = false
                    guess = "belirsiz"
                }
            } else {
                turn = false
                guess = subTree
            }
        }
        return guess
    }

    function getTree(tree, branch) {
        for (let i = 0; i < Object.keys(tree).length; i++) {
            let _branch = Object.keys(tree[i])[0]
            if (_branch == branch) {
                return Object.values(tree[i])[0];
            }
        }

    }
    function getQuest(tree) {
        let quest = Object.keys(tree[0])
        return quest[0]
    }
    //Guess kayman katman tekrardan ele alınması gerekiyor.

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
                if (files.length == 0) {
                    console.log("Karar ağacı bulunmuyor")
                    resolve(null)
                }
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
                    }

                }

                resolve(_tr)
            })()
        })
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
                        return Object.values(_data[0]);
                    } else {
                        if (_data[0].length != 0) {
                            return _data[0];
                        }
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
})()