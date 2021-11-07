const express = require("express")
const Router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const UUID = require("uuid")
const URI = `mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`
//Yeni İş 
//{ user: userID, id: UUID, form: jobFrom }
Router.post("/", async (req, res) => {
    const jobuser = req.body.user
    const jobform = req.body.form
    const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect(async (err, client) => {
            if (err) console.log('failed to connect', err)
            else {
                const collection = await client.db("AVAKADO").collection("job")
                await collection.insertOne({
                    jobuser,
                    jobid: UUID.v4(),
                    jobform,
                    bids: [],
                    state: true,
                })
                res.status(201).json({
                    success: true,
                    message: "Talep Başarıyla oluşturuldu",
                })
            }
            client.close()
        });
    } catch (error) {
        client.close()
        reject(null)
    }
})
Router.post("/addbid", async (req, res) => {
    const jobid = req.body.jobid
    const corp_mail = req.body.corp_mail
    const bid = req.body.bid
    const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect(async (err, client) => {
            if (err) console.log('failed to connect', err)
            else {
                const collection = await client.db("AVAKADO").collection("job")
                const find = await collection.findOne({ jobid: jobid })
                if (find != null) {
                    const jobBids = find.bids
                    const idx = jobBids.findIndex(item => item.corp_mail == corp_mail)
                    if (idx == -1) {
                        jobBids.push({
                            uuid: UUID.v4(),
                            corp_mail, bid
                        })
                    } else {
                        jobBids[idx] = {
                            uuid: UUID.v4(),
                            corp_mail, bid
                        }
                    }
                    await collection.updateOne({ jobid: jobid }, { $set: { bids: jobBids } })
                    if (idx == -1) {
                        res.status(200).json({
                            success: false,
                            message: "Teklifiniz Eklenmiş",
                        })
                    } else {
                        res.status(200).json({
                            success: false,
                            message: "Teklifiniz güncellendi",
                        })
                    }
                } else {
                    res.status(404).json({
                        success: false,
                        message: "İş bulunamıyor",
                    })
                }
            }
            client.close()
        });
    } catch (error) {
        client.close()
        reject(null)
    }
})
Router.get("/:mail", async (req, res) => {
    const corp_mail = req.params.mail
    const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect(async (err, client) => {
            if (err) console.log('failed to connect', err)
            else {
                const collection = await client.db("AVAKADO").collection("job")
                const result = await collection.find({ state: true, bids: { $not: { $elemMatch: { corp_mail } } } }).toArray()
                if (result != null) {
                    res.status(201).json({
                        success: true,
                        message: "oluşan talepler",
                        jobs: result
                    })
                }
            }
            client.close()
        });
    } catch (error) {
        client.close()
        reject(null)
    }
})

module.exports = Router