const worker = require('./worker');
const inquirer = require('inquirer');
const ora = require('ora');
(async () => {

  const kMeansDataPrepare = async (kNumber, label) => {
    const spinner = ora(`Calculating with ${label}..`).start();
    let time;
    let itr = true;
    let iterasyon = 0
    let wait = 0
    let waitStop = 1
    let _result;

    try {
      const startTime = process.hrtime();
      //const datas = prepareData(500)
      const datas = [
        { x: 1, y: 1 },
        { x: 1.5, y: 2 },
        { x: 3, y: 4 },
        { x: 5, y: 7 },
        { x: 3.5, y: 5 },
        { x: 4.5, y: 5 },
        { x: 3.5, y: 4.5 },
      ]
      //let Cumes = prepareCume(kNumber)
      let Cumes = [
        [
          { x: 1, y: 1 },
        ]
        ,
        [
          { x: 5, y: 7 }
        ]
      ]
      let nCumeCounts = []
      while (itr) {
        for (let i = 0; i < datas.length; i++) {
          result = await worker(datas[i], i, kNumber, Cumes, iterasyon, wait, waitStop, nCumeCounts, itr)
          _result = JSON.parse(result)
          Cumes = _result.Cumes
          iterasyon = _result.iterasyon
          itr = _result.itr
          wait = _result.wait
          waitStop = _result.waitStop
          nCumeCounts = _result.nCumeCounts
        }
      }
      console.log("Hesaplanan Kümeleme", Cumes)
      console.log("Toplam İterasyon Sayısı : ", iterasyon)


      const diffTime = process.hrtime(startTime);
      console.log("diffTime", diffTime)
      time = (diffTime[0] + diffTime[1]);
      spinner.succeed(`${label} result done in: ${time}`);
    } catch (error) {
      console.log("error", error)
    } finally {
      spinner.stop();
    }

    return time
  }

  const run = async () => {
    const { kNumber } = await inquirer.prompt([
      {
        type: 'input',
        name: 'kNumber',
        message: 'K Sayısını Giriniz :',
        default: 2,
      },
    ]);

    const timeWorker = await kMeansDataPrepare(kNumber, 'K');
    console.log(`Toplam Çalışma Süresi : ${Math.floor(timeWorker / 1000000)}ms`);
  };
  await run();

  function prepareData(count) {
    let data = []
    for (let i = 0; i < count; i++) {
      data.push({ x: (Math.random() * 100), y: (Math.random() * 100) })
    }
    return data
  }
  function prepareCume(K) {
    let Cumes = []
    for (let i = 0; i < K; i++) {
      Cumes.push([{ x: (Math.random() * 100), y: (Math.random() * 100) }])
    }
    return Cumes
  }
})();