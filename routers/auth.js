const express = require("express")
const Router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const URI = `mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`
Router.post("/singup", async (req, res) => {
    const nData = req.body
    const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect(async (err, client) => {
            if (err) console.log('failed to connect', err)
            else {
                const collection = await client.db("AVAKADO").collection("corporation")
                await collection.insertOne({
                    corp_name: nData.corp_name,
                    corp_mail: nData.corp_mail
                })
                res.status(200).json({
                    success: true,
                    message: "Başarıyla kayıt oluşturdunuz",
                })
            }
            client.close()
        });
    } catch (error) {
        client.close()
        reject(null)
    }
})

Router.post("/login", async (req, res) => {
    const corp_mail = req.body.corp_mail
    const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect(async (err, client) => {
            if (err) console.log('failed to connect', err)
            else {
                const collection = await client.db("AVAKADO").collection("corporation")
                const find = await collection.findOne({ corp_mail: corp_mail })
                console.log("find", find)
                if (find != null) {
                    res.status(200).json({
                        success: true,
                        id: find._id,
                        corp_name: find.corp_name,
                        corp_mail: find.corp_mail,
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