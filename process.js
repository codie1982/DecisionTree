const worker = require('./worker');
const inquirer = require('inquirer');
const ora = require('ora');
(async () => {

  const kMeansDataPrepare = async (inputNumber, label) => {
    const spinner = ora(`Calculating with ${label}..`).start();
    let time;
    let itr = true;
    let iterasyon = 0
    let  wait = 0
    let  waitStop = 2
    let _result;
   
    try {
      const startTime = process.hrtime();
      const datas = prepareData(1000)
      let Cumes = prepareCume(inputNumber)
      let nCumeCounts = []
      while (itr) {
        result = await worker(datas, Cumes, iterasyon,wait, waitStop,nCumeCounts,itr)
        _result = JSON.parse(result)
        Cumes = _result.Cumes
        iterasyon = _result.iterasyon
        itr = _result.itr
        wait = _result.wait
        waitStop = _result.waitStop
        nCumeCounts = _result.nCumeCounts
      }
      console.log("Hesaplanan Kümeleme",Cumes)


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

    const timeWorker = await kMeansDataPrepare(kNumber, 'K Sayısı');
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