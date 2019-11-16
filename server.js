require('@google-cloud/debug-agent').start();
let express = require('express')
let app = express()
let url = require('url')

// intially setting timesHelloed to 0
let timesHelloed = 0;

// variables to stores the minimum, maximum, mean and median values of heart rates.
let minimumHearRate=0, maximumHearRate=0, medianHearRate=0, meanHearRate=0;
let heartRates = [];




// respond when a GET request is made to the homepage
// use a response to send things back
// GET method route
app.set('view engine', 'ejs')

// handling default request
app.get('/', (req, res) => {
    res.render('home.ejs')
})

// handling /addData request
app.get('/addData', (req, res) => {
   let currentHearRate  = req.query.heartRate;
    heartRates.push(currentHearRate);
    calcHeartRates();
res.send('heartRate added\n')
})

// handling /reset request
app.get('/reset', (req, res) => {
    heartRates = [];
    minimumHearRate = 0;
    maximumHearRate = 0;
    medianHearRate = 0;
    meanHearRate = 0;

res.send('heartRate resetted\n')
})

// calcHeartRates calculates the minimum, maximum, median, mean values of heart rates.
function calcHeartRates(){
    if(heartRates.length > 0){
        minimumHearRate = heartRates[0];
        maximumHearRate = heartRates[0];
        medianHearRate = heartRates[0];
        meanHearRate = heartRates[0];
    }
    let sumOfHeartRates = 0;
    for(let i = 0; i < heartRates.length; i++){
        if(heartRates[i] < minimumHearRate){
            minimumHearRate = heartRates[i];
        }
        if(heartRates[i] > maximumHearRate){
            maximumHearRate = heartRates[i];
        }
        sumOfHeartRates = parseInt(sumOfHeartRates)+parseInt(heartRates[i]);
    }
    meanHearRate = sumOfHeartRates/heartRates.length;
    heartRates.sort();
    let heartRatesLength = heartRates.length
    if(heartRatesLength % 2 == 0){
        medianHearRate = (parseInt(heartRates[parseInt((heartRatesLength)/2)-1])
        + parseInt(heartRates[parseInt((heartRatesLength)/2)])) / 2
    }else{
        medianHearRate = heartRates[(heartRatesLength-1)/2];
    }
    console.log('Median value '+medianHearRate)
}

// handling /statistics request
app.get('/statistics', (req, res) => {
    res.render('myview.ejs', {minimumHearRate:minimumHearRate,
        maximumHearRate:maximumHearRate, meanHearRate:meanHearRate, medianHearRate:medianHearRate})
})


let port = process.env.PORT || 3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))


