
(async () => {
    const DATA = [
        {
            id: "1",
            title: "Temizlik Türü",
            node: "temizlikturu",
            branches: [
                { branch_desc: "Ev Temizliği", branch: "evtemizligi" },
                { branch_desc: "Koltuk yıkama", branch: "koltukyikama" },
                { branch_desc: "Petek Temizliği", branch: "petektemizligi" },
                { branch_desc: "İnşaat Sonrası Temizlik", branch: "insaatsonrasitemizlik" },
                { branch_desc: "Dezenfeksiyon", branch: "dezenfeksiyon" },
                { branch_desc: "Haşere İlaçlama", branch: "hasereilaclama" },
                { branch_desc: "Boş Ev Temizliği", branch: "bosevtemizligi" },
                { branch_desc: "Halı Yıkama", branch: "haliyikama" },
            ]
        },
        {
            id: "2",
            title: "Kaç Oda Salon",
            node: "kacodasalon",
            branches: [
                { branch_desc: "1 Oda 1 Salon", branch: "birodasalon" },
                { branch_desc: "2 Oda 1 Salon", branch: "ikiodasalon" },
                { branch_desc: "3 Oda 1 Salon", branch: "ucodasalon" },
                { branch_desc: "4 Oda 1 Salon", branch: "dortodasalon" },
                { branch_desc: "2 Oda 2 Salon", branch: "ikiodaikisalon" },
                { branch_desc: "3 Oda 2 Salon", branch: "ucodaikisalon" },
                { branch_desc: "4 Oda 2 Salon", branch: "dortodaikisalon" },

            ]
        },
        {
            id: "3",
            title: "Evinizde Kaç Banyo var",
            node: "kacbanyo",
            branches: [
                { branch_desc: "Banyo yok", branch: "nobanyo" },
                { branch_desc: "1 Banyo", branch: "birbanyo" },
                { branch_desc: "2 Banyo", branch: "ikibanyo" },
                { branch_desc: "3 Banyo", branch: "ücbanyo" },

            ]
        },
        {
            id: "4",
            title: "Kac Saat Temizlik",
            node: "kacsaat",
            branches: [
                { branch_desc: "1 Saat", branch: "birsaat" },
                { branch_desc: "2 Saat", branch: "ikisaat" },
                { branch_desc: "3 Saat", branch: "ucsaat" },
                { branch_desc: "4 Saat", branch: "dortsaat" },
                { branch_desc: "5 Saat", branch: "bessaat" },
                { branch_desc: "6 Saat", branch: "altisaat" },
                { branch_desc: "7 Saat", branch: "yedisaat" },
                { branch_desc: "8 Saat", branch: "sekizsaat" },
            ]
        },
        {
            id: "5",
            title: "Temizlik nekadar sıklıkla yapılsın?",
            node: "nekadarsiklik",
            branches: [
                { branch_desc: "Haftada 1 gün", branch: "haftadabirgun" },
                { branch_desc: "Haftada 2 gün", branch: "haftadaikigun" },
                { branch_desc: "Haftada 3 gün", branch: "haftadaucgun" },
                { branch_desc: "Haftada 4 gün", branch: "haftadadortgun" },
                { branch_desc: "Haftada 5 gün", branch: "haftadabesgun" },
                { branch_desc: "hergün", branch: "hergun" },
                { branch_desc: "2 Haftada bir gün", branch: "ikihaftadabirgun" },
                { branch_desc: "3 Haftada bir gün", branch: "uchaftadabirgun" },
                { branch_desc: "Ayda 1 gün", branch: "aydabirgun" },

            ]
        },
        {
            id: "6",
            title: "Evde evcil hayvan varmıdır?",
            node: "kedikopekvarmi",
            branches: [
                { branch_desc: "Evcil hayvan yoktur", branch: "evdeevcilhayvanyoktur" },
                { branch_desc: "Evde evcil 1 adet köpek bulunmaktadır", branch: "evdebiradetevcilkopekhayvanbulunmaktadir" },
                { branch_desc: "Evde evcil 2 adet köpek bulunmaktadır", branch: "evdeikiadetevcilkopekhayvanbulunmaktadir" },
                { branch_desc: "Evde evcil 1 adet Kedi bulunmaktadır", branch: "evdebiradetevcilkedihayvanbulunmaktadir" },
                { branch_desc: "Evde evcil 2 adet Kedi bulunmaktadır", branch: "evdeikiadetevcilkedihayvanbulunmaktadir" },
                { branch_desc: "Evde evcil hem kedi hem köpek bulunmaktadır", branch: "evdehemkedikemkoperbulunmaktadir" },
            ]
        },
        {
            id: "7",
            title: "Kaç adet L-şeklinde köşe koltuğu?",
            node: "Kacadetlseklindekosekoltugu",
            branches: [
                { branch_desc: "L Koltuk Bulunmuyor", branch: "nolkoltuk" },
                { branch_desc: "1 Adet", branch: "biradetlkoltuk" },
                { branch_desc: "2 Adet", branch: "ikiadetlkoltuk" },
                { branch_desc: "farklı odalarda 2 adet bulunmaktadır", branch: "farkliodalarda2seradetkoltukbulunmaktadir" },

            ]
        },
        {
            id: "8",
            title: "Kaç adet üçlü koltuk (kanepe, çekyat)?",
            node: "kacadetuclukoltuk",
            branches: [
                { branch_desc: "Üçlü Koltuk Bulunmuyor", branch: "nouclukoltuk" },
                { branch_desc: "1 Adet", branch: "biradetuclukoltuk" },
                { branch_desc: "2 Adet", branch: "ikiadetuclukoltuk" },
                { branch_desc: "Farklı odalarda 2 adet bulunmaktadır", branch: "farkliodalarda2seradetbulunmaktadir" },

            ]
        },
        {
            id: "9",
            title: "Kaç adet ikili koltuk (kanepe, çekyat)?",
            node: "kacadetikilikoltuk",
            branches: [
                { branch_desc: "İkili Koltuk Bulunmuyor", branch: "noikilikoltuk" },
                { branch_desc: "1 Adet", branch: "biradetikilikoltuk" },
                { branch_desc: "2 Adet", branch: "ikiadetikilikoltuk" },
                { branch_desc: "3 Adet", branch: "ucadetikilikoltuk" },
                { branch_desc: "4 Adet", branch: "dortadetikilikoltuk" },
                { branch_desc: "farklı odalardaa 2 şer adet bulunmaktadır", branch: "farkliodalarda2seradetikilikoltukbulunmaktadır" },

            ]
        },
        {
            id: "10",
            title: "Koltuklar minderli mi?",
            node: "koltuklarminderlimi",
            branches: [
                { branch_desc: "Koltuklar minderli değildir", branch: "hayirminderlidegil" },
                { branch_desc: "Koltuklar küçük birer minderleri bulunmaktadır", branch: "koltuklarkucukminderbulunmaktadir" },
                { branch_desc: "Koltuklar için büyük ve fazla minder bulunmaktadır", branch: "koltukkvelaricinbuyukvefazlaminderbulunmaktadir" },
                { branch_desc: "Koltuklar için büyük ve hassas kumaşlı çok sayıda minderler bulunmaktadır", branch: "koltuklaricinbuyukvehassaskumasliminderbulunmaktadir" },

            ]
        },
        {
            id: "11",
            title: "Kaç Adet Sandalye Var?",
            node: "kacsandalyevar",
            branches: [
                { branch_desc: "0 Adet Sandalye var", branch: "sıfıradetsandalye" },
                { branch_desc: "1 Adet Sandalye var", branch: "biradetsandalye" },
                { branch_desc: "2 Adet Sandalye var", branch: "ikiadetsandalye" },
                { branch_desc: "3 Adet Sandalye var", branch: "ucadetsandalye" },
                { branch_desc: "4 Adet Sandalye var", branch: "dortadetsandalye" },
                { branch_desc: "5 Adet Sandalye var", branch: "besadetsandalye" },
                { branch_desc: "6 Adet Sandalye var", branch: "altiadetsandalye" },
                { branch_desc: "7 Adet Sandalye var", branch: "yediadetsandalye" },
                { branch_desc: "8 Adet Sandalye var", branch: "sekizadetsandalye" },
            ]
        },
        {
            id: "12",
            title: "Kaç adet petek temizlenecek?",
            node: "kacpetektemizlenecek",
            branches: [
                { branch_desc: "Petekler temizlenmeyecek", branch: "petektemizlenmeyecek" },
                { branch_desc: "1 Adet petek temizlenecek", branch: "birpetektemizlenecek" },
                { branch_desc: "2 Adet petek temizlenecek", branch: "ikipetektemizlenecek" },
                { branch_desc: "3 Adet petek temizlenecek", branch: "ucpetektemizlenecek" },
                { branch_desc: "4 Adet petek temizlenecek", branch: "dortpetektemizlenecek" },
                { branch_desc: "5 Adet petek temizlenecek", branch: "bespetektemizlenecek" },
                { branch_desc: "6 Adet petek temizlenecek", branch: "altipetektemizlenecek" },
                { branch_desc: "7 Adet petek temizlenecek", branch: "yedipetektemizlenecek" },
                { branch_desc: "8 Adet petek temizlenecek", branch: "sekizpetektemizlenecek" },
                { branch_desc: "her odada temizlenecek oetekler bulunmaktadır", branch: "herodadatemizlenecekpetekbulunmaktadır" },
            ]
        },
        {
            id: "14",
            title: "Kaç metrekare temizlenecek?",
            node: "kacmetrekaretemizlenecek",
            branches: [
                { branch_desc: "50 metrekare", branch: "ellimetrekare" },
                { branch_desc: "100 metrekare", branch: "yuzmetrekare" },
                { branch_desc: "150 metrekare", branch: "yuzellimetrekare" },
                { branch_desc: "200 metrekare", branch: "ikiyuzmetrekare" },
                { branch_desc: "250 metrekare", branch: "ikiyuzellimetrekare" },
                { branch_desc: "300 metrekare", branch: "ucyuzmetrekare" },
                { branch_desc: "350 metrekare", branch: "ucyuzellimetrekare" },
            ]
        },
        {
            id: "19",
            title: "İlaçlama yapılacak ise mekan tipini seçin?",
            node: "ilaclanacakmekantipi",
            branches: [
                { branch_desc: "İlaçlama yok", branch: "noilac" },
                { branch_desc: "Ev Daire", branch: "evdaire" },
                { branch_desc: "Bina", branch: "bina" },
                { branch_desc: "Bahçe", branch: "bahce" },
                { branch_desc: "Ofis", branch: "ofis" },
                { branch_desc: "Okul", branch: "okul" },
                { branch_desc: "Çocuk Oyun alanı", branch: "cocukoyunalani" },
            ]
        },
        {
            id: "20",
            title: "Toplam kaç m2 alan ilaçlanacak?",
            node: "toplamkacmetrekareilaclanacak",
            branches: [
                { branch_desc: "İlaçlama yok", branch: "noilac" },
                { branch_desc: "20 Metrekare", branch: "yirmimetrekare" },
                { branch_desc: "40 Metrekare", branch: "kirkmetrekare" },
                { branch_desc: "60 Metrekare", branch: "almismetrekare" },
                { branch_desc: "80 Metrekare", branch: "seksenmetrekare" },
                { branch_desc: "100 Metrekare", branch: "yüzmetrekare" },
            ]
        },
        {
            id: "21",
            title: "Halılar yıkanacakmı?",
            node: "halılarneredeyikansin",
            branches: [
                { branch_desc: "Hayır Halılar yıkanmayacak", branch: "halilaryikanmayacak" },
                { branch_desc: "Halılar yerinden alınıp yıkansın", branch: "adrestenaliniptemizlensin" },
                { branch_desc: "Halılar yerinde temizlensin", branch: "yerindehalitemizliği" },
                { branch_desc: "Halılar hassah şekilde yıkansın", branch: "halilarhassasyikansin" },
            ]
        },
        {
            id: "22",
            title: "İlce",
            node: "ilce",
            branches: [
                { branch_desc: "Silivri", branch: "silivri" },
                { branch_desc: "Çatalca", branch: "catalca" },
                { branch_desc: "Büyükçekmece", branch: "buyukcekmece" },
                { branch_desc: "Küçükcekmece", branch: "kucukcekmece" },
                { branch_desc: "Gaziosmanpaşa", branch: "gaziosmanpasa" },
                { branch_desc: "Bakırköy", branch: "bakirkoy" },
                { branch_desc: "Şişli", branch: "sisli" },
                { branch_desc: "Beşiktaş", branch: "besiktas" },
                { branch_desc: "Sarıyer", branch: "sariyer" },
            ]
        },
    ]
    const express = require("express")
    const Router = express.Router();
    const MongoClient = require("mongodb").MongoClient;
    const fs = require('fs')
    const path = require("path")
    const UUID = require("uuid")
    const URI = `mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false`
    const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect(async (err, client) => {
        if (err) console.log('failed to connect', err)
        else {

            const corpCollection = await client.db("AVAKADO").collection("corporation")

            const corpList = await corpCollection.find().toArray()

            let itr = true
            let iteration = 0;
            while (itr) {
                let jobForm = []
                for (let i = 0; i < DATA.length - 1; i++) {
                    let rand = Math.floor(Math.random() * DATA[i].branches.length)
                    let formitem = {
                        node: DATA[i].node, branch: DATA[i].branches[rand].branch
                    }
                    jobForm.push(formitem)
                }
                let bids = []
                for (let j = 0; j < corpList.length; j++) {
                    let rndBid = Math.round(Math.random() * 1)
                    if (rndBid) {
                        let rand = Math.floor(Math.random() * 1500)
                        let bid = {
                            uuid: UUID.v4(),
                            corp_mail: corpList[j].corp_mail,
                            bid: rand,
                        }
                        bids.push(bid)
                    }
                }
                const collection = await client.db("AVAKADO").collection("job")
                await collection.insertOne({
                    jobuser: UUID.v4(),
                    jobid: UUID.v4(),
                    jobform: jobForm,
                    bids: bids,
                    state: false,
                })
                //itr = false
                iteration > 50 ? itr = false : iteration++
            }
        }
        client.close()
    });
})()