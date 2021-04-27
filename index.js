
(async () => {
    var express = require("express")
    var http = require("http")
    var bodyParser = require("body-parser")
    var path = require("path")
    const app = express()
    const server = http.createServer(app)


    app.get('/', (req, res) => {
        res.status(200).json({
            title: "Karar ağacı YZ",
        })
    })

    server.listen(5000, () => console.log(`IBB Mobil Servis 5000 Port'u Üzerinde Çalışıyor`));

})()