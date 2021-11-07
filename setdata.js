
(async () => {
    const express = require("express")
    const Router = express.Router();
    const MongoClient = require("mongodb").MongoClient;
    const fs = require('fs')
    const path = require("path")
    const URI = `mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`
    const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect(async (err, client) => {
        if (err) console.log('failed to connect', err)
        else {
            let corps = [];
            const corpCollection = await client.db("AVAKADO").collection("corporation")
            const mailList = await corpCollection.find().project({ _id: 0, corp_mail: 1 }).toArray()
            //console.log("findCorp", mailList)
            /*   for (let i = 0; i < mailList.length; i++) {
                  let corp_mail = Object.values(mailList[i])[0]
                  //console.log("corp_mail", corp_mail)
                  const jobCollection = await client.db("AVAKADO").collection("job")
                  const findJob = await jobCollection.find({ bids: { $elemMatch: { corp_mail } } }).toArray()
                  console.log("findJob", findJob)
                  break;
              } */
            const jobCollection = await client.db("AVAKADO").collection("job")
            const jobs = await jobCollection.find({ state: false }).toArray()
            let titleList = jobs[0].jobform.map(item => item.node)
            titleList.push("teklif")
            const titleListText = titleList.join(";")
            for (let j = 0; j < mailList.length; j++) {
                const corp_mail = Object.values(mailList[j])[0]
                let corp_name = corp_mail.split("@")[1]
                fs.appendFileSync(__dirname + "/data/" + corp_name + ".csv", titleListText, function (err) {
                    if (err) return console.log(err);
                });
            }

            for (let i = 0; i < jobs.length; i++) {
                const job = jobs[i]
                for (let j = 0; j < mailList.length; j++) {
                    const form = job.jobform.map(item => item.branch);
                    let answerText = "";
                    const corp_mail = Object.values(mailList[j])[0]
                    let corp_name = corp_mail.split("@")[1]
                    const findIdx = job.bids.findIndex(item => item.corp_mail == corp_mail)
                    if (findIdx == -1) {
                        //form.push(0)
                        form.push("hayir")
                    } else {
                        //form.push(job.bids[findIdx].bid)
                        form.push("evet")
                    }
                    //console.log("form",form)
                    answerText = answerText + "\n" + form.join(";")

                    fs.appendFileSync(__dirname + "/data/" + corp_name + ".csv", answerText, function (err) {
                        if (err) return console.log(err);
                    });
                }

            }
        }
        client.close()
    });
})()